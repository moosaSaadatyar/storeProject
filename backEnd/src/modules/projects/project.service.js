const mongoose = require('mongoose');
const Project = require('./project.model');
const Category = require('../categories/categories.model');
const { parsePaging, paginationMeta } = require('../../utils/api-response');
const { PAGING } = require('../../config/constants');

/**
 * ساخت شرط جست‌وجو روی متن
 */
function escapeRegExp(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function textSearch(query) {
  if (!query) return {};
  const regex = new RegExp(escapeRegExp(String(query).trim()), 'i');
  return { $or: [{ title: regex }, { shortDescription: regex }, { location: regex }] };
}

/**
 * لیست عمومی پروژه‌های منتشرشده با فیلترها و صفحه‌بندی
 */
async function getPublicList(query) {
  const { page, limit, skip } = parsePaging(query, PAGING.maxLimit, PAGING.defaultLimit);

  const filter = { isPublished: true };

  // دسته‌بندی با slug
  if (query.category) {
    const category = await Category.findOne({ slug: String(query.category).trim(), isActive: true });
    filter.category = category ? category._id : new mongoose.Types.ObjectId('000000000000000000000000');
  }

  if (query.style) filter.style = String(query.style);
  if (query.space) filter.space = String(query.space);
  if (query.featured !== undefined && query.featured !== '') {
    filter.isFeatured = query.featured === 'true' || query.featured === true;
  }

  Object.assign(filter, textSearch(query.q));

  const [items, total] = await Promise.all([
    Project.find(filter)
      .populate('category', 'name slug image icon')
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Project.countDocuments(filter),
  ]);

  return paginationMeta(items, total, page, limit);
}

/**
 * جزئیات عمومی یک پروژه + پروژه‌های مرتبط (تا ۴ هم‌دسته)
 */
async function getPublicById(id) {
  const project = await Project.findOne({ _id: id, isPublished: true })
    .populate('category', 'name slug image icon description')
    .lean();

  if (!project) return null;

  const related = await Project.find({
    _id: { $ne: project._id },
    category: project.category._id,
    isPublished: true,
  })
    .sort({ isFeatured: -1, createdAt: -1 })
    .limit(4)
    .select('title coverImage style space isFeatured _id')
    .lean();

  return { ...project, related };
}

/**
 * لیست مدیریتی (همه شامل پیش‌نویس)
 */
async function getAdminList(query) {
  const { page, limit, skip } = parsePaging(query, PAGING.maxLimit, 10);
  const filter = {};
  Object.assign(filter, textSearch(query.q));
  if (query.category) filter.category = query.category;
  if (query.isPublished !== undefined && query.isPublished !== '') {
    filter.isPublished = query.isPublished === 'true';
  }

  const [items, total] = await Promise.all([
    Project.find(filter)
      .populate('category', 'name slug image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Project.countDocuments(filter),
  ]);

  return paginationMeta(items, total, page, limit);
}

/**
 * ساخت داده‌ی سند پروژه از فیلدهای فرم (بدون فایل‌ها)
 */
function buildProjectData(body) {
  const data = {
    title: String(body.title || '').trim(),
    shortDescription: String(body.shortDescription || '').trim(),
    fullDescription: String(body.fullDescription || '').trim(),
    style: body.style || null,
    space: body.space || null,
    bodyMaterial: String(body.bodyMaterial || '').trim(),
    doorMaterial: String(body.doorMaterial || '').trim(),
    countertop: String(body.countertop || '').trim(),
    hardware: String(body.hardware || '').trim(),
    features: safeFeatures(body.features),
    duration: String(body.duration || '').trim(),
    location: String(body.location || '').trim(),
    isFeatured: toBool(body.isFeatured),
    isPublished: toBool(body.isPublished, true),
  };

  if (body.category) data.category = body.category;

  if (body.areaValue !== undefined && body.areaValue !== '' && !isNaN(Number(body.areaValue))) {
    data.area = { value: Number(body.areaValue), unit: String(body.areaUnit || 'متر مربع').trim() };
  }

  return data;
}

function safeFeatures(value) {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map((v) => String(v).trim()).filter(Boolean);
    } catch {
      return value.split('\n').map((v) => v.trim()).filter(Boolean);
    }
  }
  return [];
}

function toBool(value, defaultValue = false) {
  if (value === undefined || value === null || value === '') return defaultValue;
  return value === true || value === 'true' || value === '1';
}

/**
 * به‌روزرسانی — فقط فیلدهای موجود در body اعمال می‌شوند (merge جزئی)
 */
async function updateProject(id, body) {
  const data = {};
  const fields = [
    'title', 'shortDescription', 'fullDescription',
    'bodyMaterial', 'doorMaterial', 'countertop', 'hardware', 'duration', 'location',
  ];
  for (const field of fields) {
    if (body[field] !== undefined) data[field] = String(body[field] ?? '').trim();
  }
  if (body.category !== undefined) data.category = body.category || null;
  if (body.style !== undefined) data.style = body.style || null;
  if (body.space !== undefined) data.space = body.space || null;
  if (body.features !== undefined) data.features = safeFeatures(body.features);
  if (body.isFeatured !== undefined) data.isFeatured = toBool(body.isFeatured);
  if (body.isPublished !== undefined) data.isPublished = toBool(body.isPublished, true);
  if (body.areaValue !== undefined && body.areaValue !== '') {
    data.area = !isNaN(Number(body.areaValue))
      ? { value: Number(body.areaValue), unit: String(body.areaUnit || 'متر مربع').trim() }
      : undefined;
  }

  return Project.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true }).populate('category', 'name slug image');
}

module.exports = {
  getPublicList,
  getPublicById,
  getAdminList,
  buildProjectData,
  updateProject,
};
