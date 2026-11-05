import type { SortingState } from '@tanstack/solid-table';
import type { Setter } from 'solid-js';
import type { DocumentSearchSortField, DocumentSearchSortOrder } from './documents.constants';
import { createParamSynchronizedSignal } from '@/modules/shared/signals/params';
import { resolveSetterValue } from '@/modules/shared/signals/setters';
import {
  DEFAULT_DOCUMENT_SEARCH_SORT_FIELD,
  DEFAULT_DOCUMENT_SEARCH_SORT_ORDER,
  DOCUMENT_SEARCH_SORT_FIELDS,
  DOCUMENT_SEARCH_SORT_ORDERS,
} from './documents.constants';

// Sort field and order synchronized with the `sortField` / `sortOrder` URL params,
// exposed both as raw values (for the API call) and as a table SortingState
export function createParamSynchronizedDocumentsSorting() {
  const [getSortField, setSortField] = createParamSynchronizedSignal<DocumentSearchSortField>({
    paramKey: 'sortField',
    defaultValue: DEFAULT_DOCUMENT_SEARCH_SORT_FIELD,
    deserialize: (value) =>
      DOCUMENT_SEARCH_SORT_FIELDS.includes(value as DocumentSearchSortField)
        ? (value as DocumentSearchSortField)
        : DEFAULT_DOCUMENT_SEARCH_SORT_FIELD,
  });

  const [getSortOrder, setSortOrder] = createParamSynchronizedSignal<DocumentSearchSortOrder>({
    paramKey: 'sortOrder',
    defaultValue: DEFAULT_DOCUMENT_SEARCH_SORT_ORDER,
    deserialize: (value) =>
      DOCUMENT_SEARCH_SORT_ORDERS.includes(value as DocumentSearchSortOrder)
        ? (value as DocumentSearchSortOrder)
        : DEFAULT_DOCUMENT_SEARCH_SORT_ORDER,
  });

  const getSorting = (): SortingState => [{ id: getSortField(), desc: getSortOrder() === 'desc' }];

  const setSorting: Setter<SortingState> = (valueOrUpdater) => {
    const next = resolveSetterValue(valueOrUpdater, getSorting());
    const first = next[0];
    if (!first) {
      setSortField(DEFAULT_DOCUMENT_SEARCH_SORT_FIELD);
      setSortOrder(DEFAULT_DOCUMENT_SEARCH_SORT_ORDER);
      return next;
    }
    setSortField(first.id as DocumentSearchSortField);
    setSortOrder(first.desc ? 'desc' : 'asc');
    return next;
  };

  return { getSortField, getSortOrder, getSorting, setSorting };
}
