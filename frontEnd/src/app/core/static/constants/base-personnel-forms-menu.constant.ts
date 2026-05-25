import { IDynamicSelectItem } from "core/components/dynamics/mo-select/mo-select.interface";
import { RahianAccess } from 'shared/enums/rahian-access/rahian-access.enum';
import { SetupPagesEnum } from 'features/account/registration/enums/setup-pages.enum';

export type TRoutingPermissions =
  {
    permission: RahianAccess,
    route: SetupPagesEnum
  };

export type BasePersonnelMenuModel =
  {
    forms: any[],
    questionnaires: any[]
  };

//TODO__
export const BasePersonnelFormsMenuConstant: TRoutingPermissions[] = [
  { permission: RahianAccess.REQUESTACTION_DEFAULT_BASICPERSONNELINFORMATION, route: SetupPagesEnum.MAIN_INFORMATION },
  { permission: RahianAccess.REQUESTACTION_DEFAULT_RELIGIONINFORMATION, route: SetupPagesEnum.MAIN_INFORMATION },
  { permission: RahianAccess.REQUESTACTION_DEFAULT_JOBINFORMATION, route: SetupPagesEnum.MAIN_INFORMATION },
  { permission: RahianAccess.REQUESTACTION_DEFAULT_EDUCATIONALINFORMATION, route: SetupPagesEnum.MAIN_INFORMATION },
  { permission: RahianAccess.REQUESTACTION_DEFAULT_PHYSICALINFORMATION, route: SetupPagesEnum.MAIN_INFORMATION },
  { permission: RahianAccess.REQUESTACTION_DEFAULT_TRAININGHISTORY, route: SetupPagesEnum.TRAINING_HISTORY },
  { permission: RahianAccess.REQUESTACTION_DEFAULT_MARTIALHISTORY, route: SetupPagesEnum.MARTIAL_HISTORY},
  { permission: RahianAccess.REQUESTACTION_DEFAULT_NARRATIONHISTORY, route: SetupPagesEnum.NARRATIVE_HISTORY },
  { permission: RahianAccess.REQUESTACTION_DEFAULT_PHENOMENAHISTORY, route: SetupPagesEnum.PHENOMENA_HISTORY },
  { permission: RahianAccess.REQUESTACTION_DEFAULT_SPECIALTYHISTORY, route: SetupPagesEnum.SPECIALIST },
  { permission: RahianAccess.REQUESTACTION_DEFAULT_RESEARCHHISTORY, route: SetupPagesEnum.RESEARCH_HISTORY },
  { permission: RahianAccess.REQUESTACTION_DEFAULT_TEACHINGHISTORY, route: SetupPagesEnum.TEACHING_HISTORY },
  { permission: RahianAccess.REQUESTACTION_DEFAULT_BANKINFORMATION, route: SetupPagesEnum.BANK_INFORMATION },

];

export const PRESENCE_TYPE: IDynamicSelectItem[] = [
  { topic: 'راهیان نور استقراری', id: 2 },
  { topic: 'راهیان نور همراه کاروان', id: 3 },
  { topic: 'غیر راهیان نور', id: 5 }
]
