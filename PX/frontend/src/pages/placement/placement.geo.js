import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Select } from 'semantic-ui-react';
import { changePlacement, placementGeoSearch } from "../../redux/actions/placement.actions";
import classNames from 'classnames';
import { capitalize } from "../../functions";

class PlacementGeo extends Component {
  handleSelect = (event, data) => {
    this.props.changePlacement({ prop: data.name, value: data.value });
  };

  handleSearch = (geoType, name, category, event) => {
    this.props.placementGeoSearch({ geoType, name, category, fragment: event.target.value, selection: this.props[`${geoType}${capitalize(name)}`] });
  };

  render() {
    const { includedCountries, excludedCountries, includedProvinces, excludedProvinces, includedDma, excludedDma, includedPostalCodes, excludedPostalCodes, includedCities, excludedCities, includedGeoCountries, excludedGeoCountries, includedGeoProvinces, excludedGeoProvinces, includedGeoDma, excludedGeoDma, includedGeoPostalCodes, excludedGeoPostalCodes, includedGeoCities, excludedGeoCities } = this.props;
    const { dropdownStyle } = styles;

    return (
      <form className='form'>
        <div className='form__half'>
          <div className='form__inside' >
            <h5>Included Geo</h5>
             <div className='float-container'>
              {includedCountries.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': includedCountries.length })} >Country</label> : <label> </label>}
              <Select placeholder="Country" style={dropdownStyle} value={includedCountries ? includedCountries : ['']} multiple selection search fluid name="includedCountries" options={includedGeoCountries} onChange={this.handleSelect} onSearchChange={this.handleSearch.bind(null, 'included', 'countries', 'user_geo_countrys')} />
            </div>
          </div>

          <div className='form__inside' >
             <div className='float-container'>
              {includedProvinces.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': includedProvinces.length })} >Province</label> : <label> </label>}
              <Select placeholder="Province" style={dropdownStyle} value={includedProvinces ? includedProvinces : ['']} multiple search fluid name="includedProvinces" options={includedGeoProvinces} onChange={this.handleSelect} onSearchChange={this.handleSearch.bind(null, 'included', 'provinces', 'user_geo_provinces')} />
            </div>
          </div>

          <div className='form__inside' >
             <div className='float-container'>
              {includedDma.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': includedDma.length })} >DMA</label> : <label> </label>}
              <Select placeholder="DMA" value={includedDma ? includedDma : ['']} style={dropdownStyle} multiple search fluid name="includedDma" options={includedGeoDma} onChange={this.handleSelect} onSearchChange={this.handleSearch.bind(null, 'included', 'dma', 'user_geo_dmas')} />
            </div>
          </div>

          <div className='form__inside' >
             <div className='float-container'>
              {includedCities.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': includedCities.length })} >City</label> : <label> </label>}
              <Select placeholder="City" value={includedCities ? includedCities : ['']} style={dropdownStyle} multiple selection search fluid name="includedCities" options={includedGeoCities} onChange={this.handleSelect} onSearchChange={this.handleSearch.bind(null, 'included', 'cities', 'user_geo_citys')} />
            </div>
          </div>

          <div className='form__inside' >
             <div className='float-container'>
              {includedPostalCodes.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': includedPostalCodes.length })} >Postal Code</label> : <label> </label>}
              <Select placeholder="Postal Code" value={includedPostalCodes ? includedPostalCodes : ['']} style={dropdownStyle} multiple selection search fluid name="includedPostalCodes" options={includedGeoPostalCodes} onChange={this.handleSelect} onSearchChange={this.handleSearch.bind(null, 'included', 'postalCodes', 'user_geo_postal_codes')} />
            </div>
          </div>
          <h5>Excluded Geo</h5>
          <div className='form__inside' >
             <div className='float-container'>
              {excludedCountries.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': excludedCountries.length })} >Country</label> : <label> </label>}
              <Select placeholder="Country" style={dropdownStyle} value={excludedCountries ? excludedCountries : ['']} multiple selection search fluid name="excludedCountries" options={includedGeoCountries} onChange={this.handleSelect} onSearchChange={this.handleSearch.bind(null, 'included', 'countries', 'user_geo_countrys')} />
            </div>
          </div >

          <div className='form__inside' >
             <div className='float-container'>
              {excludedProvinces.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': excludedProvinces.length })} >Province</label> : <label> </label>}
              <Select placeholder="Province" style={dropdownStyle} value={excludedProvinces ? excludedProvinces : ''} multiple search fluid name="excludedProvinces" options={includedGeoProvinces} onChange={this.handleSelect} onSearchChange={this.handleSearch.bind(null, 'included', 'provinces', 'user_geo_provinces')} />
            </div>
          </div>

          <div className='form__inside' >
             <div className='float-container'>
              {excludedDma.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': excludedDma.length })} >DMA</label> : <label> </label>}
              <Select placeholder="DMA" value={excludedDma ? excludedDma : ['']} style={dropdownStyle} multiple search fluid name="excludedDma" options={includedGeoDma} onChange={this.handleSelect} onSearchChange={this.handleSearch.bind(null, 'included', 'dma', 'user_geo_dmas')} />
            </div>
          </div>

          <div className='form__inside' >
             <div className='float-container'>
              {excludedCities.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': excludedCities.length })} >City</label> : <label> </label>}
              <Select placeholder="City" value={excludedCities ? excludedCities : ['']} style={dropdownStyle} multiple selection search fluid name="excludedCities" options={includedGeoCities} onChange={this.handleSelect} onSearchChange={this.handleSearch.bind(null, 'included', 'cities', 'user_geo_citys')} />
            </div>
          </div>

          <div className='form__inside' >
             <div className='float-container'>
              {excludedPostalCodes.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': excludedPostalCodes.length })} >Postal Code</label> : <label> </label>}
              <Select placeholder="Postal Code" value={excludedPostalCodes ? excludedPostalCodes : ['']} multiple label="Postal Code" style={dropdownStyle} selection search fluid name="excludedPostalCodes" options={includedGeoPostalCodes} onChange={this.handleSelect} onSearchChange={this.handleSearch.bind(null, 'included', 'postalCodes', 'user_geo_postal_codes')} />
            </div>
          </div>
        </div>
      </form>
    )
  }
}

const styles = {
  dropdownStyle: {
    marginBottom: "10px"
  }
};

const mapStateToProps = state => {
  const { includedCountries, excludedCountries, includedProvinces, excludedProvinces, includedDma, excludedDma, includedPostalCodes, excludedPostalCodes, includedCities, excludedCities, includedGeoCountries, excludedGeoCountries, includedGeoProvinces, excludedGeoProvinces, includedGeoDma, excludedGeoDma, includedGeoPostalCodes, excludedGeoPostalCodes, includedGeoCities, excludedGeoCities } = state.placement;

  return { includedCountries, excludedCountries, includedProvinces, excludedProvinces, includedDma, excludedDma, includedPostalCodes, excludedPostalCodes, includedCities, excludedCities, includedGeoCountries, excludedGeoCountries, includedGeoProvinces, excludedGeoProvinces, includedGeoDma, excludedGeoDma, includedGeoPostalCodes, excludedGeoPostalCodes, includedGeoCities, excludedGeoCities };
};

export default connect(mapStateToProps, { changePlacement, placementGeoSearch })(PlacementGeo);