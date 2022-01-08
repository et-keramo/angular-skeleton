import { Injectable } from '@angular/core';
import { Pagination } from '@model/common/pagination.model';
import { TREE_STATUS } from '@app/global';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TreeFilter {

  execute(pagination: Pagination, row: any, dateField?: string) {
    let dateFilter = false;
    let keywordFilter = false;

    const date = dateField ? row[dateField] : row.regDt;
    if (date && pagination.fromDate && pagination.toDate) {
      dateFilter = moment(date).isBetween(pagination.fromDate, pagination.toDate);
    } else {
      dateFilter = true;
    }

    if (dateFilter) {
      if (pagination.keywords?.length > 0) {

        switch (pagination.operator) {
          case 'AND':
            keywordFilter = this.likeAND(pagination.keywords, row.name);
            break;
          case 'OR':
            keywordFilter = this.likeOR(pagination.keywords, row.name);
            break;
        }

        if (keywordFilter && row.treeStatus !== TREE_STATUS.DISABLED) {
          row.treeStatus = TREE_STATUS.EXPANDED;
        }
      } else {
        keywordFilter = true;
      }
    }

    return dateFilter && keywordFilter;
  }

  likeAND(keywords: any[], target: any) {
    const found = keywords.find(keyword => {
      const _keyword = keyword.toString().toLowerCase();
      const _target = target.toString().toLowerCase();
      return _target.search(_keyword) < 0;
    });

    return found ? false : true;
  }

  likeOR(keywords: any[], target: any) {
    const found = keywords.find(keyword => {
      const _keyword = keyword.toString().toLowerCase();
      const _target = target.toString().toLowerCase();
      return _target.search(_keyword) >= 0;
    });

    return found ? true : false;
  }

}
