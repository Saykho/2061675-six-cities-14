import React, { useEffect, useState } from 'react';
import { Header } from '../../components/header';
import { Location } from '../../components/location';
import { Empty } from '../../components/empty';
import { OffersList } from '../../components/offers-list';
import { OfferType } from '../../types';
import { Map } from '../../components/map';
import { useAppDispatch } from '../../hooks/use-dispatch.ts';
import { changeCityAction } from '../../store/action.ts';
import { useAppSelector } from '../../hooks/use-typed-selector.ts';
import { useSelector } from 'react-redux';
import { getCitiesSelector, getLoadingSelector, getSelectedCitySelector } from '../../store/reducer.ts';
import { SortOptions } from '../../components/sort-options';
import { fetchOffers } from '../../store/async-actions/fetch-offers.ts';
import { Loader } from '../../components/loader';

type MainProps = {
  placesCount: number;
}
export const Main: React.FC<MainProps> = ({placesCount}) => {
  const [sortOption, setSortOption] = useState('Popular');
  const [selectedPoint, setSelectedPoint] = useState<OfferType['id'] | null>(null);

  const dispatch = useAppDispatch();
  const citiesSet = useSelector(getCitiesSelector);
  const selectedCity = useSelector(getSelectedCitySelector);
  const offers = useAppSelector((state) => state.cities.offers);
  let city = citiesSet.find((c) => c.name === selectedCity?.name);
  const isLoading = useSelector(getLoadingSelector);

  if (city === undefined) {
    city = citiesSet[0];
  }
  const offersInSelectedCity = offers.filter((offer) => offer.city.name === selectedCity?.name);

  const handleCardHover = (offerId: OfferType['id'] | null) => {
    setSelectedPoint(offerId);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };
  useEffect(() => {
    if (!selectedCity) {
      dispatch(changeCityAction({
        city: {
          name: 'Paris',
          location: {zoom: 13, latitude: 48.85661, longitude: 2.351499}
        }
      }));
    }
    dispatch(fetchOffers());
  }, []);

  return (
    <div className="page page--gray page--main">
      <Header/>
      <main
        className={`page__main page__main--index ${offersInSelectedCity.length === 0 ? 'page__main--index-empty' : ''}`}
      >
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <ul className="locations__list tabs__list">
              {citiesSet.map((c) => (
                <li key={c.name} className="locations__item">
                  <Location
                    locationName={c.name}
                    active={`${selectedCity?.name === c.name ? 'locations__item-link tabs__item tabs__item--active' : 'locations__item-link tabs__item'}`}
                    onClick={() => dispatch(changeCityAction({city: c}))}
                  />
                </li>
              ))}
            </ul>
          </section>
        </div>
        {
          isLoading ? (
            <Loader/>
          ) : (
            <div className="cities">
              {
                offersInSelectedCity.length ?
                  <div className="cities__places-container container">
                    <section className="cities__places places">
                      <h2 className="visually-hidden">Places</h2>
                      <b className="places__found">{placesCount} places to stay in Amsterdam</b>
                      <SortOptions selectedSortOption={sortOption} onSortChange={handleSortChange}/>
                      <div className="cities__places-list places__list tabs__content">
                        <OffersList
                          offers={offersInSelectedCity}
                          onCardHover={handleCardHover}
                          className="cities__card"
                          classNameWrapper="cities__image-wrapper"
                          imgWidth="260"
                          imgHeight="200"
                          sortOption={sortOption}
                        />
                      </div>
                    </section>
                    <div className="cities__right-section">
                      <section className="cities__map map">
                        <Map points={offers} selectedPoint={selectedPoint} city={city}/>
                      </section>
                    </div>
                  </div> : <Empty/>

              }
            </div>
          )
        }
      </main>
    </div>
  );
};
