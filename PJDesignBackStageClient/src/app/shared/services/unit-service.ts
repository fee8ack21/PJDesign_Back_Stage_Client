import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ResponseBase } from '../models/bases';
import { StageType, StatusCode, TemplateType, UnitID } from '../models/enums';
import { GetUnitsRequest, GetUnitsResponse, UnitList } from '../models/get-units';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';
@Injectable()

export class UnitService {
  isBackStageUnitsInit = new BehaviorSubject<boolean>(false);

  private _units: GetUnitsResponse[] | undefined;
  private _fixedUnits: UnitList[] = [];
  private _customUnits: UnitList[] = [];

  constructor(private httpService: HttpService, private authService: AuthService) { }

  async getBackStageUnitsByGroupId(): Promise<{ fixedUnits: UnitList[], customUnits: UnitList[] }> {
    if (this._units != undefined) { return { fixedUnits: this._fixedUnits, customUnits: this._customUnits } };

    let request = new GetUnitsRequest(StageType.後台, undefined, this.authService.getAdministrator()?.groupId);

    const response = await this.httpService.post<ResponseBase<GetUnitsResponse[]>>('unit/getUnits', request).toPromise();
    if (response.statusCode == StatusCode.Success) {
      this._units = response.entries!;
      this._setFormattedUnits(response.entries! as UnitList[])

      this.isBackStageUnitsInit.next(true);
      return { fixedUnits: this._fixedUnits, customUnits: this._customUnits };
    }

    return { fixedUnits: [], customUnits: [] };
  }

  getCurrentUnit(): { id: number, name: string } {
    if (this._units == null || this._units.length == 0) { return { id: -1, name: '' }; }

    const path = window.location.pathname + window.location.search;
    let filtededUnits = [];
    if (window.location.pathname.includes('type')) {
      if (window.location.pathname.includes('detail')) {
        var txt = `uid=${new URLSearchParams(window.location.search).get('uid')}`;
        filtededUnits = this._units.filter(x => x.backStageUrl != null ? x.backStageUrl.includes(txt) : false);
      } else {
        filtededUnits = this._units.filter(x => x.backStageUrl != null ? path == x.backStageUrl.trimStart().trim() ?? '' : false);
      }
    } else {
      filtededUnits = this._units.filter(x => x.backStageUrl != null ? path.includes(x.backStageUrl) : false);
    }

    if (filtededUnits.length == 0) { return { id: -1, name: '' }; }

    return { id: filtededUnits[0].id, name: filtededUnits[0].name };
  }

  private _setFormattedUnits(units: UnitList[]) {
    let fixedUnits: UnitList[] = []
    let customUnits: UnitList[] = []
    let childUnits: UnitList[] = []

    units.forEach(unit => {
      if (unit.parent) {
        childUnits.push(unit);
        return;
      }

      if (unit.templateType == TemplateType.固定單元) {
        fixedUnits.push(unit)
        return;
      }

      customUnits.push(unit);
    })

    childUnits.forEach(c => {
      let hasMatched = false;
      fixedUnits.forEach(f => {
        if (f.id == c.parent) {
          if (f.children == null) {
            f.children = [c];
          } else {
            f.children.push(c);
          }
        }
      })

      if (hasMatched) { return; }
      customUnits.forEach(cs => {
        if (cs.id == c.parent) {
          if (cs.children == null) {
            cs.children = [c];
          } else {
            cs.children.push(c);
          }
        }
      })
    })

    this._fixedUnits = fixedUnits;
    this._customUnits = customUnits;
  }

  public clearUnits() {
    this._units = undefined;
    this._fixedUnits = [];
    this._customUnits = [];
  }

  public getUnitIcon(id: number) {
    switch (id) {
      case UnitID.帳戶管理:
        return 'people';
      case UnitID.單元管理:
        return 'dashboard';
      case UnitID.審核列表:
        return 'list';
      case UnitID.首頁設定:
        return 'settings';
      case UnitID.Footer設定:
        return 'settings';
      case UnitID.作品集:
        return 'photo';
      case UnitID.客戶服務:
        return 'work';
      case UnitID.常見問題:
        return 'question_answer';
      case UnitID.聯絡我們:
        return 'email';
      default:
        return 'settings';
    }
  }
}
