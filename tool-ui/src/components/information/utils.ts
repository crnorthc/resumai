import type { PositionPayload } from '../../types';
import { getApplicantData, updateApplicantData } from '../../utils';

export function addPosition(data: PositionPayload) {
  const currentData = getApplicantData();
  const positions = currentData.positions ?? [];

  positions.push(data);

  currentData.positions = positions;

  updateApplicantData(currentData);
}

export function updatePosition(data: PositionPayload, position_index: number) {
  const currentData = getApplicantData();
  const positions = currentData.positions;

  if (!positions || positions.length < position_index) {
    throw Error('Invalid position index');
  }

  positions[position_index] = data;

  updateApplicantData(currentData);
}

export function deletePosition(position_index: number) {
  const currentData = getApplicantData();
  const positions = currentData.positions;

  if (!positions || positions.length < position_index) {
    throw Error('Invalid position index');
  }

  positions.splice(position_index, 1);

  updateApplicantData(currentData);
}
