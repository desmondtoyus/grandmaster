import {
  CHANGE_MENU_STATE,
  MENU_RESET_ACTIVE
} from './types';

export const changeMenuState = ({ prop, value }) => dispatch => {
  dispatch({ type: CHANGE_MENU_STATE, prop, value });
};

export const resetActive = () => dispatch => {
  dispatch({ type: MENU_RESET_ACTIVE });
};