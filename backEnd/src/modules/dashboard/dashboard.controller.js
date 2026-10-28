const Project = require('../projects/project.model');
const Category = require('../categories/categories.model');
const CabinetService = require('../services/services.model');
const Consultation = require('../consultations/consultations.model');
const ContactMessage = require('../contact/contact.model');
const Testimonial = require('../testimonials/testimonials.model');
const { ok } = require('../../utils/api-response');

/**
 * GET /api/admin/dashboard/stats
 * آمار کلی پنل مدیریت
 */
async function stats(req, res, next) {
  try {
    const [
      projects,
      publishedProjects,
      featuredProjects,
      categories,
      services,
      consultations,
      consultationsByStatus,
      contactMessages,
      newContactMessages,
      testimonials,
      pendingTestimonials,
      recentConsultations,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ isPublished: true }),
      Project.countDocuments({ isFeatured: true }),
      Category.countDocuments(),
      CabinetService.countDocuments(),
      Consultation.countDocuments(),
      Consultation.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ status: 'new' }),
      Testimonial.countDocuments(),
      Testimonial.countDocuments({ isApproved: false }),
      Consultation.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    const statusMap = Object.fromEntries(consultationsByStatus.map((s) => [s._id, s.count]));

    return ok(res, {
      projects: {
        total: projects,
        published: publishedProjects,
        featured: featuredProjects,
      },
      categories: { total: categories },
      services: { total: services },
      consultations: {
        total: consultations,
        new: statusMap['new'] || 0,
        inProgress: statusMap['in-progress'] || 0,
        completed: statusMap['completed'] || 0,
        cancelled: statusMap['cancelled'] || 0,
      },
      contactMessages: { total: contactMessages, new: newContactMessages },
      testimonials: { total: testimonials, pending: pendingTestimonials },
      recentConsultations,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { stats };
