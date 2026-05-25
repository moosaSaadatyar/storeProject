import { InjectionToken, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { IDynamicSelectItem } from 'core/components/dynamics/mo-select/mo-select.interface';
import { NonEmptyArray } from 'core/components/dynamics/mo-table/mo-table.interface';
import { TDynamicSelectItemsFunc } from 'core/types/common/common.type';
import { UtilizationCheckInCheckOutStatus } from '../enums/utilization/utilization-check-in-check-out-status';
import { Evaluations } from 'core/enums/evaluation/evaluation.enum';
import { ConvoyType, EConvoyType } from 'shared/enums/convoyType/convoy-type.enum';

export const STATUS_TYPE = [
  { topic: 'ثبت اولیه', id: 2 },
  { topic: 'انتشار', id: 3 },
  { topic: 'اتمام', id: 5 },
  { topic: 'لغو', id: 7 },
];

export const INTERVIEW_STATUS_TYPE = [
  { topic: 'ثبت نهايي', id: true },
  { topic: 'ثبت موقت', id: false },
];

export const SEVERITY_INTERVIEW_CLASS = [
  { topic: 'success', id: true },
  { topic: 'warning', id: false },
];
export const MEASUREMENT_TYPE_FILTER = [
  { topic: 'دارای پاسخ', id: 2 },
  { topic: 'بدون پاسخ', id: 3 },
];

export const STATUS_TYPE_PLANING_FILTER = [
  { topic: 'ثبت اولیه', id: 2 },
  { topic: 'انتشار', id: 3 },
  { topic: 'اتمام', id: 5 },
  { topic: 'لغو', id: 7 },
];

export const ACTIVATION_STATUS_TYPE = [
  { topic: 'نامشخص', id: 0 },
  { topic: 'فعال', id: 2 },
  { topic: 'غیر فعال', id: 3 },
  { topic: 'مسدود', id: 5 },
];

export const USER_ACTIVATION_MODE = [
  { topic: 'فعال', id: true },
  { topic: 'غیرفعال', id: false },
];

export const USER_ACTIVATION_SEVERITY_MODE = [
  { topic: 'success', id: true },
  { topic: 'danger', id: false },
];

export const UTILIZATION_REQUEST_STATUS_TYPE = () => {
  const translate = inject(TranslateService);
  return [
    { topic: translate.instant('PENDING'), id: 2 },
    { topic: translate.instant('ACCEPT'), id: 3 },
    { topic: translate.instant('REJECT'), id: 5 },
    { topic: translate.instant('CANCEL'), id: 7 },
    { topic: translate.instant('COMPLETE'), id: 9 },
  ];
};

export const UTILIZATION_REQUEST_SEVERITY_STATUS_CLASS = [
  { topic: 'info', id: 2 },
  { topic: 'success', id: 3 },
  { topic: 'danger', id: 5 },
  { topic: 'secondary', id: 9 },
  { topic: 'warning', id: 7 },
];

export const UTILIZATION_CHECK_IN_CHECK_OUT_STATUS_TYPE = () => {
  const translate = inject(TranslateService);

  return [
    { topic: translate.instant('NO_STATUS'), id: UtilizationCheckInCheckOutStatus.None },
    { topic: translate.instant('CHECK_IN'), id: UtilizationCheckInCheckOutStatus.CheckIn },
    { topic: translate.instant('CHECK_OUT'), id: UtilizationCheckInCheckOutStatus.CheckOut },
    {
      topic: translate.instant('CHECK_IN_CHECK_OUT_RETURN_DEST_DATE_REGISTER'),
      id: UtilizationCheckInCheckOutStatus.ReturnDestinationAndDateRegister,
    },
  ];
};

export const UTILIZATION_CHECK_IN_CHECK_OUT_SEVERITY_STATUS_CLASS = [
  { topic: 'info', id: UtilizationCheckInCheckOutStatus.None },
  { topic: 'success', id: UtilizationCheckInCheckOutStatus.CheckIn },
  { topic: 'danger', id: UtilizationCheckInCheckOutStatus.CheckOut },
  { topic: 'secondary', id: UtilizationCheckInCheckOutStatus.ReturnDestinationAndDateRegister },
];

export const UTILIZATION_DIFFUSIONS = () => {
  const translate = inject(TranslateService);
  return [
    { topic: translate.instant('INVITATION'), id: 3 },
    { topic: translate.instant('SMS'), id: 2 },
    { topic: translate.instant('NOTIFICATION'), id: 5 },
    // { topic: 'حضوری', id: 11 },
    // { topic: 'فضای مجازی', id: 13 },
    // { topic: 'تلفنی', id: 17 }
  ];
};

export const USER_ACTIVATION_TYPE = [
  { topic: 'فعال', id: 2 },
  { topic: 'غیر فعال', id: 3 },
  { topic: 'مسدود', id: 5 },
];

export const USER_ACTIVATION_SEVERITY_TYPE = [
  { topic: 'نامشخص', id: 0 },
  { topic: 'success', id: 2 },
  { topic: 'danger', id: 3 },
];

export const SEVERITY_STATUS_CLASS = [
  { topic: 'normal', id: 0 },
  { topic: 'success', id: 1 },
  { topic: 'success', id: 2 },
  { topic: 'info', id: 3 },
  { topic: 'danger', id: 5 },
  { topic: 'warning', id: 7 },
];

export const EVALUATION_STATUS_TYPE = [
  { topic: 'مرجع', id: true },
  { topic: 'اقتضایی', id: false },
];

export const EVALUATION_SEVERITY_TYPE = [
  { topic: 'success', id: true },
  { topic: 'normal', id: false },
];

export const DIFFUSIONS = [
  { topic: 'فراخوان', id: 3 },
  { topic: 'پیامک', id: 2 },
  { topic: 'اطلاعیه', id: 5 },
  // { topic: 'با کد', id: 7 },
  { topic: 'حضوری', id: 11 },
  { topic: 'فضای مجازی', id: 13 },
  { topic: 'تلفنی', id: 17 },
];
export const DIFFUSIONS_CONVOY = [
  { topic: 'پیامک', id: 2 },
  { topic: 'اطلاعیه', id: 5 },
];

export const COOPERATION_DIFFUSIONS = [
  { topic: 'فراخوان', id: 3 },
  { topic: 'پیامک', id: 2 },
];

export const DIFFUSIONS_SEVERITY_TYPE = [
  { topic: 'info', id: 3 },
  { topic: 'warning', id: 2 },
  { topic: 'info', id: 5 },
  { topic: 'success', id: 7 },
  { topic: 'success', id: 11 },
  { topic: 'danger', id: 13 },
  { topic: 'secondary', id: 17 },
];

export const E_INTERVIEW_STATUS = [
  { topic: 'در حال مصاحبه', id: 2 },
  { topic: 'اتمام', id: 3 },
];

export const E_INTERVIEW_SEVERITY = [
  { topic: 'success', id: 2 },
  { topic: 'info', id: 3 },
];

export const GrantRecord = [
  { id: 2, value: 'قابلیت دسترسی این نقش و زیر مجموعه این نقش به دیگران' },
  { id: 3, value: 'قابلیت دسترسی فقط زیر مجموعه این نقش به دیگران' },
  { id: 5, value: 'هیچکدام' },
];

export const E_REGISTER_RESULT_STATUS = [
  {
    bValue: true,
    topic: 'تایید',
  },
  {
    bValue: false,
    topic: 'رد',
  },
];

export const DEFECTS_STATUS = [
  {
    id: true,
    topic: 'تکمیل نواقص',
  },
  {
    id: false,
    topic: 'ارسال نواقص',
  },
];

export const DEFECTS_SEVERITY = [
  {
    id: true,
    topic: 'success',
  },
  {
    id: false,
    topic: 'danger',
  },
];

export const BOOLEAN_TO_YES_OR_NO = [
  {
    bValue: true,
    topic: 'بله',
  },
  {
    bValue: false,
    topic: 'خیر',
  },
];

export const CAN_REVIEW = [
  {
    bValue: true,
    topic: 'دارد',
  },
  {
    bValue: false,
    topic: 'ندارد',
  },
];

export const STATUS_ACCESS_MANAGEMENT_TYPE = [
  { id: 1, topic: 'صدور مجوز' },
  { id: 2, topic: 'ویرایش تاریخ پایان اعتبار' },
];

export const SEVERITY_ACCESS_MANAGEMENT_TYPE = [
  { id: 1, topic: 'success' },
  { id: 2, topic: 'secondary' },
];

export const TYPE_OWNERSHIP = [
  { label: 'عمومی', value: true },
  { label: 'حقوقی', value: false },
];
export const CATEGORY_LIST = [
  { id: 1, label: 'CAPITAL' },
  { id: 2, label: 'CONSUMPTION' },
];

export const COOPERATION_REQUEST_STATUSES = () => {
  const translate = inject(TranslateService);

  return [
    { topic: translate.instant('INITIAL_SUBMIT'), id: 2 },
    { topic: translate.instant('PENDING'), id: 3 },
    { topic: translate.instant('ACCEPT'), id: 5 },
    { topic: translate.instant('REJECT'), id: 7 },
    { topic: translate.instant('PRESENCE'), id: 11 },
    { topic: translate.instant('ABSENCE'), id: 13 },
    { topic: translate.instant('CANCEL'), id: 17 },
  ];
};
export const CONVOY_TYPE_SELECT = () => {
  const translate = inject(TranslateService);
  return [
    { topic: translate.instant('LAYERS'), id: EConvoyType.CONVOY_TYPE_STRATA },
    { topic: translate.instant('CAR_CONVOY'), id: EConvoyType.CONVOY_TYPE_PERSONAL_CAR },
    { topic: translate.instant('STUDENT2_CONVOY'), id: EConvoyType.CONVOY_TYPE_STUDENT },
    { topic: translate.instant('UNIVERSITY_STUDENT'), id: EConvoyType.CONVOY_TYPE_COLLEGIAN },
  ];
};

export const COOPERATION_REQUEST_SEVERITY = () => [
  { topic: 'primary', id: 2 },
  { topic: 'info', id: 3 },
  { topic: 'success', id: 5 },
  { topic: 'danger', id: 7 },
  { topic: 'success', id: 11 },
  { topic: 'danger', id: 13 },
  { topic: 'warning', id: 17 },
];

export const CITIZEN_SHIPS = (): TDynamicSelectItemsFunc => {
  const translate = inject(TranslateService);

  return () => [
    { topic: translate.instant('IRANIAN'), bValue: true, isDefault: true },
    { topic: translate.instant('NON_IRANIAN'), bValue: false },
  ];
};

export const IS_MARRIED = (): TDynamicSelectItemsFunc => {
  const translate = inject(TranslateService);

  return () => [
    { topic: translate.instant('MARRIED'), bValue: true },
    { topic: translate.instant('MERELY'), bValue: false },
  ];
};

export const utilizationPresenceRequestStatuses = new InjectionToken<
  () => NonEmptyArray<IDynamicSelectItem>
>('utilizationPresenceRequestStatuses', {
  providedIn: 'root',
  factory: () => {
    const translate = inject(TranslateService);
    return () => [
      { topic: translate.instant('PENDING'), id: 3 },
      { topic: translate.instant('ACCEPT'), id: 5 },
      { topic: translate.instant('REJECT'), id: 7 },
      { topic: translate.instant('FULL_CAPACITY'), id: 17 },
      { topic: translate.instant('CANCEL'), id: 17 },
    ];
  },
});

export const utilizationPresenceRequestAttendanceStatuses = new InjectionToken<
  () => NonEmptyArray<IDynamicSelectItem>
>('utilizationPresenceRequestAttendanceStatuses', {
  providedIn: 'root',
  factory: () => {
    const translate = inject(TranslateService);
    return () => [
      { topic: translate.instant('NON_ATTENDANCE'), id: 3 },
      { topic: translate.instant('PRESENCE'), id: 5 },
      { topic: translate.instant('NOT_ANNOUNCED'), id: 7 },
    ];
  },
});

export const ACCOMMODATION_PLANE_STATUS = () => {
  const translate = inject(TranslateService);

  return [
    { topic: translate.instant('INITIAL_SUBMIT'), id: 2 },
    { topic: translate.instant('DIFFUSION'), id: 3 },
    { topic: translate.instant('FINISH_RESERVATION'), id: 5 },
    { topic: translate.instant('FINISH_RECEPTION'), id: 7 },
    { topic: translate.instant('ABOLITION'), id: 11 },
  ];
};

export const ACCOMMODATION_PLANE_SEVERITY = () => [
  { topic: 'success', id: 2 },
  { topic: 'info', id: 3 },
  { topic: 'primary', id: 5 },
  { topic: 'warning', id: 7 },
  { topic: 'danger', id: 11 },
];

export const ACCOMMODATION_RESERVATION_PAYMENT_PILL_STATUS = () => {
  const translate = inject(TranslateService);

  return [
    { topic: translate.instant('PENDING'), id: 2 },
    { topic: translate.instant('ACCEPT'), id: 3 },
    { topic: translate.instant('FAILED'), id: 5 },
    { topic: translate.instant('RECEPTION'), id: 7 },
    { topic: translate.instant('CHECK_OUT'), id: 11 },
    { topic: translate.instant('CANCEL'), id: 13 },
    { topic: translate.instant('ABOLITION'), id: 17 },
  ];
};

export const ACCOMMODATION_RESERVATION_PAYMENT_PILL_SEVERITY = () => {
  return [
    { topic: 'info', id: 2 },
    { topic: 'success', id: 3 },
    { topic: 'danger', id: 5 },
    { topic: 'success', id: 7 },
    { topic: 'warning', id: 11 },
    { topic: 'warning', id: 13 },
    { topic: 'primary', id: 17 },
  ];
};
export const PASSENGER_REGISTERATION_PAYMENT_PILL_STATUS = () => {
  const translate = inject(TranslateService);

  return [
    { topic: translate.instant('WAIT_FOR_CHECK'), id: 2 },
    { topic: translate.instant('ACCEPT'), id: 3 },
    { topic: translate.instant('REJECT'), id: 5 },
  ];
};
export const KITCHEN_RESERVATION_PAYMENT_PILL_STATUS = () => {
  const translate = inject(TranslateService);

  return [
    { topic: translate.instant('PENDING'), id: 2 },
    { topic: translate.instant('ACCEPT'), id: 3 },
    { topic: translate.instant('FAILED'), id: 5 },
    { topic: translate.instant('CANCEL'), id: 13 },
  ];
};

export const KITCHEN_RESERVATION_PAYMENT_PILL_SEVERITY = () => {
  return [
    { topic: 'info', id: 2 },
    { topic: 'success', id: 3 },
    { topic: 'danger', id: 5 },
    { topic: 'warning', id: 13 },
  ];
};

export const UTILIZATION_RECEPTION_EQUIPMENT_STATUS = () => {
  const translate = inject(TranslateService);

  return [
    { topic: translate.instant('NONE_STATUS'), id: 2 },
    { topic: translate.instant('DELIVERED'), id: 3 },
    { topic: translate.instant('RECEIVED'), id: 5 },
  ];
};

export const UTILIZATION_RECEPTION_EQUIPMENT_SEVERITY = () => [
  { topic: 'info', id: 2 },
  { topic: 'primary', id: 3 },
  { topic: 'success', id: 5 },
  { topic: 'danger', id: 7 },
  { topic: 'success', id: 11 },
  { topic: 'danger', id: 13 },
  { topic: 'warning', id: 17 },
];

export const ROLL_CALL_STATUS = [
  { topic: 'بدون وضعیت', id: 2 },
  { topic: 'حاضر', id: 3 },
  { topic: 'غیبت موجه', id: 5 },
  { topic: 'غیبت غیر موجه', id: 7 },
  { topic: 'ماموریت', id: 9 },
];

export const ROLL_CALL_STATUS_CLASS = [
  { topic: 'warning', id: 2 },
  { topic: 'success', id: 3 },
  { topic: 'info', id: 5 },
  { topic: 'danger', id: 7 },
  { topic: 'secondary', id: 9 },
];

export const LIQUIDATION_STATUS = [
  { topic: 'تسویه شده', id: 2 },
  { topic: 'تسویه نشده', id: 3 },
];

export const LIQUIDATION_SEVERITY = [
  { topic: 'success', id: 2 },
  { topic: 'info', id: 3 },
];

export const LIQUIDATION_EQUIPMENT_STATUS = [
  { topic: 'بدون وضعیت', id: 2 },
  { topic: 'تحویل شده', id: 3 },
  { topic: 'بازگردانده', id: 5 },
];

export const LIQUIDATION_EQUIPMENT_SEVERITY = [
  { topic: 'warning', id: 2 },
  { topic: 'normal', id: 3 },
  { topic: 'success', id: 5 },
];

export const CONVOY_STATUS = [
  { id: 2, topic: 'ثبت اولیه' },
  { id: 3, topic: 'انتشار' },
  { id: 5, topic: 'در انتظار اجرا' },
  { id: 7, topic: 'در حال اجرا' },
  { id: 11, topic: 'پایان سفر' },
  { id: 13, topic: 'لغو' },
  { id: 17, topic: 'اتمام' },
];

export const CONVOY_STATUS_CLASS = [
  { id: 2, topic: 'primary' },
  { id: 3, topic: 'info' },
  { id: 5, topic: 'normal' },
  { id: 7, topic: 'primary' },
  { id: 11, topic: 'success' },
  { id: 13, topic: 'warning' },
  { id: 17, topic: 'danger' },
];

export const KITCHEN_PLANE_STATUS_CLASS = [
  { id: 1, topic: 'success' },
  { id: 2, topic: 'secondary' },
  { id: 3, topic: 'danger' },
  { id: 5, topic: 'warning' },
  { id: 7, topic: 'danger' },
];
export const KITCHEN_PLANE_STATUS = [
  { topic: 'ثبت اولیه', id: 1 },
  { topic: 'سفارش گیری', id: 2 },
  { topic: 'پایان سفارش گیری', id: 3 },
  { topic: ' اتمام خدمات', id: 5 },
  { topic: 'لغو', id: 7 },
];
export const MEASURING_ITEM = () => {
  const translate = inject(TranslateService);

  return [
    { topic: translate.instant('ROLE'), id: Evaluations.ROLE, process: 'measuring' },
    { topic: translate.instant('CERTIFICATE'), id: Evaluations.CERTIFICATE, process: 'measuring' },
    { topic: translate.instant('PLAN'), id: Evaluations.PLAN, process: 'measuring' },
    {
      topic: translate.instant('ORGANIZATIONAL_STRUCTURE'),
      id: Evaluations.ORGANIZATIONAL_STRUCTURE,
      process: 'measuring',
    },
  ];
};

export const CONVOY_TYPE = () => {
  return [
    { code: 2, id: ConvoyType.CONVOY_TYPE_STRATA },
    { code: 3, id: ConvoyType.CONVOY_TYPE_PERSONAL_CAR },
    { code: 5, id: ConvoyType.CONVOY_TYPE_STUDENT },
    { code: 7, id: ConvoyType.CONVOY_TYPE_COLLEGIAN },
  ];
};

export const ASSESSOR_ITEM = () => {
  const translate = inject(TranslateService);

  return [
    { topic: translate.instant('ROLE'), id: Evaluations.ROLE, process: 'assessor' },
    { topic: translate.instant('CERTIFICATE'), id: Evaluations.CERTIFICATE, process: 'assessor' },
  ];
};

export const CAR_CONVOY_REQUEST_STATUS = () => {
  const translate = inject(TranslateService);

  return [
    { topic: translate.instant('WAIT_FOR_CHECK'), id: 2 },
    { topic: translate.instant('ACCEPT'), id: 3 },
    { topic: translate.instant('REJECT'), id: 5 },
    { topic: translate.instant('CANCEL'), id: 7 },
    { topic: translate.instant('TRANSFER_ED'), id: 11 },
  ];
};

export const CAR_CONVOY_REQUEST_STATUS_BG_CLASS = () => {
  return [
    { topic: 'info', id: 2 },
    { topic: 'success', id: 3 },
    { topic: 'danger', id: 5 },
    { topic: 'warning', id: 7 },
    { topic: 'green-light', id: 11 },
  ];
};
export const CAR_CONVOY_REQUEST_STATUS_CLASS = () => {
  return [
    { topic: 'info', id: 2 },
    { topic: 'green-light', id: 3 },
    { topic: 'danger', id: 5 },
    { topic: 'warning', id: 7 },
  ];
};
export const CONVOY_ACCIDENT_LOC_TYPE = () => {
  const translate = inject(TranslateService);

  return [
    { topic: translate.instant('MEMORIAL'), id: 2 },
    { topic: translate.instant('ACCOMMODATION'), id: 3 },
  ];
};
export const CAR_CONVOY_REQUEST_TRANSFER_STATUS = () => {
  const translate = inject(TranslateService);

  return [
    { topic: translate.instant('WAIT_FOR_CHECK'), id: 2 },
    { topic: translate.instant('TRANSFER'), id: 3 },
    { topic: translate.instant('NON_TRANSFER'), id: 5 },
  ];
};

export const CONVOY_REQUEST_LOTTERY_STATUS = () => {
  const translate = inject(TranslateService);

  return [
    { topic: translate.instant('WITH_CONVOY_LOTTERY'), id: 2 },
    { topic: translate.instant('CONVOY_LOTTERY_LOSE'), id: 3 },
  ];
};
export const CAR_CONVOY_REQUEST_CREDITDEBIT_STATUS = () => {
  const translate = inject(TranslateService);

  return [
    { topic: translate.instant('CREDITOR'), id: 2 },
    { topic: translate.instant('DEBTOR'), id: 3 },
    { topic: translate.instant('LIQUIDATION'), id: 5 },
  ];
};
export const CAR_CONVOY_PAYED_COST_TYPE = () => {
  const translate = inject(TranslateService);

  return [
    { topic: translate.instant('DEPOSITLY'), id: 2, bValue: true },
    { topic: translate.instant('REFUNDEDLY'), id: 3, bValue: false },
  ];
};
export const CAR_CONVOY_PAYED_COST_STATUS = () => {
  const translate = inject(TranslateService);

  return [
    { topic: translate.instant('WAIT_FOR_CHECK'), id: 2 },
    { topic: translate.instant('TRANSFER'), id: 3 },
    { topic: translate.instant('NON_TRANSFER'), id: 5 },
  ];
};
export const CAR_CONVOY_PAYMENT_STATUS = () => {
  const translate = inject(TranslateService);

  return [
    { topic: translate.instant('PAYMENT_PENDING'), id: 2 },
    { topic: translate.instant('PROCCESSING_PAYMENT'), id: 3 },
    { topic: translate.instant('COMPLETED_PAYMENT'), id: 5 },
    { topic: translate.instant('EXPIRED_PAYMENT'), id: 7 },
  ];
};
export const MEAL_ITEMS = () => {
  const translate = inject(TranslateService);
  return [
    { topic: translate.instant('BREAKFAST'), id: 2 },
    { topic: translate.instant('LUNCH'), id: 3 },
    { topic: translate.instant('DINNER'), id: 5 },
  ];
};

export const PEYMENT_STATUS = () => {
  const translate = inject(TranslateService);
  return [
    { topic: translate.instant('UNKNOWN'), id: 0 },
    { topic: translate.instant('DEBTOR'), id: 2 },
    { topic: translate.instant('CREDITOR'), id: 3 },
    { topic: translate.instant('LIQUIDATION'), id: 5 },
  ];
};

export const KITCHEN_RESERVATION_STATUS = () => {
  const translate = inject(TranslateService);
  return [
    { topic: translate.instant('WAIT_FOR_CHECK'), id: 2 },
    { topic: translate.instant('INITIAL_ACCEPT'), id: 3 },
    { topic: translate.instant('FINAL_ACCEPT'), id: 5 },
    { topic: translate.instant('REJECT'), id: 7 },
    { topic: translate.instant('DELIVERY'), id: 11 },
    { topic: translate.instant('CANCEL'), id: 13 },
  ];
};

export const KITCHEN_RESERVATION__CLASS = () => {
  return [
    { topic: 'bg-info', id: 2 },
    { topic: 'bg-green-light', id: 3 },
    { topic: 'bg-success', id: 5 },
    { topic: 'bg-danger', id: 7 },
    { topic: 'bg-primary', id: 11 },
    { topic: 'bg-warning', id: 13 },
  ];
};
export const MEASUREMENT_STATUS = () => {
  const translate = inject(TranslateService);
  return [
    { topic: translate.instant('INITIAL_SUBMIT'), id: 2 },
    { topic: translate.instant('DIFFUSION'), id: 3 },
    { topic: translate.instant('DIFFUSION_END'), id: 5 },
  ];
};

export const MEASUREMENT_CLASS = () => {
  return [
    { topic: 'success', id: 2 },
    { topic: 'info', id: 3 },
    { topic: 'danger', id: 5 },
  ];
};

export const KITCHEN_RESERVATION_PAYMENT_STATUS = () => {
  const translate = inject(TranslateService);
  return [
    { topic: translate.instant('PAYMENT_PENDING'), id: 2 },
    { topic: translate.instant('PROCCESSING_PAYMENT'), id: 3 },
    { topic: translate.instant('COMPLETED_PAYMENT'), id: 5 },
    { topic: translate.instant('EXPIRED_PAYMENT'), id: 7 },
  ];
};

export const CONVOY_TYPE_LABEL = () => {
  const translate = inject(TranslateService);
  return [
    { topic: translate.instant('LAYERS'), id: 2 },
    { topic: translate.instant('CAR_CONVOY'), id: 3 },
    { topic: translate.instant('SCHOOL_STUDENT'), id: 5 },
    { topic: translate.instant('UNIVERSITY_STUDENT'), id: 7 },
  ];
};

export const CONVOY_ROLE_LABEL = () => {
  const translate = inject(TranslateService);
  return [
    { topic: translate.instant('SUPERVISOR'), id: 2 },
    { topic: translate.instant('PILGRIM'), id: 3 },
  ];
};

export const KITCHEN_RESERVATION_PAYMENT_STATUS_CLASS = () => {
  return [
    { topic: 'bg-info', id: 2 },
    { topic: 'bg-green-light', id: 3 },
    { topic: 'bg-success', id: 5 },
    { topic: 'bg-warning', id: 7 },
  ];
};

export const RESERVATION_STATUS = () => {
  const translate = inject(TranslateService);
  return [
    { topic: translate.instant('UNKNOWN'), id: 0 },
    { topic: translate.instant('WAIT_FOR_CHECK'), id: 2 },
    { topic: translate.instant('INITIAL_ACCEPT'), id: 3 },
    { topic: translate.instant('ACCEPTED'), id: 5 },
    { topic: translate.instant('REJECT'), id: 7 },
    { topic: translate.instant('DELIVERED'), id: 11 },
    { topic: translate.instant('CANCEL'), id: 13 },
  ];
};

export const MEAL_ORDER_CLASS = () => {
  return [
    { topic: 'bg-light', id: 0 },
    { topic: 'bg-info', id: 2 },
    { topic: 'bg-success', id: 3 },
    { topic: 'bg-danger', id: 5 },
    { topic: 'bg-success', id: 7 },
    { topic: 'bg-warning', id: 11 },
    { topic: 'bg-warning', id: 13 },
    { topic: 'bg-primary', id: 17 },
  ];
};

export const VERIFY_COMPANIONS_STATUS = () => {
  const translate = inject(TranslateService);
  return [
    { topic: translate.instant('VERIFY_PENDING'), id: 2 },
    { topic: translate.instant('VERIFY_SUCCESSFUL'), id: 3 },
    { topic: translate.instant('VERIFY_UN_SUCCESSFUL'), id: 5 },
  ];
};

export const VERIFY_COMPANIONS_STATUS_CLASS = () => {
  return [
    { topic: 'warning', id: 2 },
    { topic: 'success', id: 3 },
    { topic: 'danger', id: 5 },
  ];
};
export const SETTLEMENT_STATUS = () => {
  const translate = inject(TranslateService);
  return [
    { topic: translate.instant('LIQUIDATION_HAS_SETTLEMENT'), id: 2 },
    { topic: translate.instant('LIQUIDATION_NO_SETTLEMENT'), id: 3 },
  ];
};
export const FINISH_STATUS = (): TDynamicSelectItemsFunc => {
  const translate = inject(TranslateService);

  return () => [
    { topic: translate.instant('شده'), bValue: true },
    { topic: translate.instant('نشده'), bValue: false },
  ];
};
export enum placeType {
  MEMORIAL = '1ec3dca7-4b99-48a4-a79f-0f3d8af10dff',
  PLACES = '939401b5-a10b-002f-c287-3a0a719fa286',
}