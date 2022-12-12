export class GetUnitsRequest {
  stageType?: number;
  groupId?: number;
  templateType?: number;
}

export class GetUnitsResponse {
  id: number;
  name: string;
  backStageUrl?: string;
  templateType: number;
  frontStageUrl?: string;
  isAnotherWindow: boolean;
  isEnabled?: boolean;
  createDt: Date;
  parent?: number;
  stageType: number;
  sort?: number;
}

export class UnitList extends GetUnitsResponse {
  children: UnitList[];
}
