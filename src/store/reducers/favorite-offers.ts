import { SelectedOffer } from '../../types';
import { StateStatus } from '../../const';
import { createReducer, createSelector } from '@reduxjs/toolkit';
import { fetchFavoriteOffersAction } from '../async-actions';

interface FavoriteOffersState {
  favoriteOffers: SelectedOffer[];
  status: StateStatus;
  loading: boolean;
  favoriteStatus: number;
}

const initialState: FavoriteOffersState = {
  favoriteOffers: [],
  loading: false,
  status: StateStatus.idle,
  favoriteStatus: 0,
};

export const favoritesOffersReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(fetchFavoriteOffersAction.pending, (state) => ({
      ...state,
      loading: true,
      status: StateStatus.loading,
    }))
    .addCase(fetchFavoriteOffersAction.fulfilled, (state, {payload}) => ({
      ...state,
      favoriteOffers: payload,
      status: StateStatus.idle,
      loading: false,
    }))
    .addCase(fetchFavoriteOffersAction.rejected, (state, {payload}) => {
      if (payload) {
        return {
          ...state,
          error: payload,
        };
      }
      return {
        ...state,
        status: StateStatus.idle,
      };
    })
);

type WithFavoriteOffersState = {
  favoriteOffers: FavoriteOffersState;
}

export const favoriteOffersStateSelector = (
  state: WithFavoriteOffersState,
): FavoriteOffersState => state.favoriteOffers;

export const getFavoriteOffersStateSelector = createSelector(
  favoriteOffersStateSelector,
  (state) => state.favoriteOffers
);
