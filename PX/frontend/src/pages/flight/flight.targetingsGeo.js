import React, { Component } from 'react';
import { Select, Button, Divider, Icon, Checkbox  } from 'semantic-ui-react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { changeFlight, flightGeoSearch } from "../../redux/actions/flight.actions";
import { capitalize } from "../../functions";

class FlightGeo extends Component {
  state={
    included_country:false, 
    excluded_country:false, 
    included_province:false, 
    excluded_province:false, 
    included_Dma:false, 
    excluded_Dma:false, 
    included_code:false, 
    excluded_code:false, 
    included_city:false, 
    excluded_city:false,
    showGeo:false
  }

  handleClick = event => {
    event.preventDefault();
    let value;
    const { name} = event.target;
   switch (name) {
     case 'included_country':
       this.setState({included_country:!this.state.included_country, excluded_country:false})
       break;
       case 'excluded_country':
       this.setState({excluded_country:!this.state.excluded_country, included_country:false})
       break;
       case 'included_province':
       this.setState({included_province:!this.state.included_province, excluded_province:false})
       break;
       case 'excluded_province':
       this.setState({excluded_province:!this.state.excluded_province, included_province:false})
       break;
       case 'included_Dma':
       this.setState({included_Dma:!this.state.included_Dma, excluded_Dma:false})
       break;
       case 'excluded_Dma':
       this.setState({excluded_Dma:!this.state.excluded_Dma, included_Dma:false})
       break;
       case 'included_code':
       this.setState({included_code:!this.included_code, excluded_code:false})
       break;
       case 'excluded_code':
       this.setState({excluded_code:!this.excluded_code, included_code:false})
       break;
       case 'included_city':
       this.setState({included_city:!this.included_city, excluded_city:false})
       break;
       case 'excluded_city':
       this.setState({excluded_city:!this.excluded_city, included_city:false})
       break;
     default:
       break;
   }
    
    // this.setState({
    //   [name]: !value
    // });
  };


  handleSelect = (event, data) => {
    this.props.changeFlight({ prop: data.name, value: data.value });
  };

  handleSearch = (geoType, name, category, event) => {
    this.props.flightGeoSearch({ geoType, name, category, fragment: event.target.value, selection: this.props[`${geoType}${capitalize(name)}`] });
  };

  handleCheckbox=()=>{
    this.setState({showGeo: !this.state.showGeo})
  }
  render() {
    const { includedCountries, excludedCountries, includedProvinces, excludedProvinces, includedDma, excludedDma, includedPostalCodes, excludedPostalCodes, includedCities, excludedCities, includedGeoCountries, excludedGeoCountries, includedGeoProvinces, excludedGeoProvinces, includedGeoDma, excludedGeoDma, includedGeoPostalCodes, excludedGeoPostalCodes, includedGeoCities, excludedGeoCities } = this.props;
    const { dropdownStyle } = styles;

    return (
      <div style={{marginLeft:'2px'}}>
        <Checkbox label="Geo Targeting" onClick={this.handleCheckbox} checked={this.state.showGeo ||((excludedCountries.length ||includedCountries.length || includedProvinces.length || excludedProvinces.length || excludedDma.length  || includedDma.length || excludedCities.length || includedCities.length || excludedPostalCodes.length || includedPostalCodes.length) > 0)} />
      {this.state.showGeo ||(excludedCountries.length ||includedCountries.length || includedProvinces.length || excludedProvinces.length || excludedDma.length  || includedDma.length || excludedCities.length || includedCities.length || excludedPostalCodes.length || includedPostalCodes.length) ?<form className='form'>
         <div className='form__half'>
        
         <div className='form__inside' >
            {/* <h5>Included Geo</h5> */}
            <div className='form__full' ><b>Country</b></div>
            <div className='form__full' > <Button.Group size='tiny'>
             
    {/* <Button onClick={this.handleClick} name='none' value='none'  >{(excludedCountries.length || includedCountries.length) ? null: <Icon name="check" />}None</Button> */}
    {!excludedCountries.length ?  <Button onClick={this.handleClick} name='included_country' value='included_country' className={classNames({ 'active-flight-type': includedCountries.length})} >{includedCountries.length ? <Icon name="check" />:null}Included</Button>:null}
   {!includedCountries.length ? <Button onClick={this.handleClick} name='excluded_country' value='excluded_country' className={classNames({ 'active-flight-type': excludedCountries.length})}  >{excludedCountries.length ?<Icon name="check" />:null} Excluded</Button>:null}
  </Button.Group></div>
             {this.state.included_country ? <div className='float-container'>
              {includedCountries.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': includedCountries.length })} >Included Country</label> : <label> </label>}
              <Select placeholder="Included Country" style={dropdownStyle} value={includedCountries ? includedCountries : ['']} multiple selection search fluid name="includedCountries" options={includedGeoCountries} onChange={this.handleSelect} onSearchChange={this.handleSearch.bind(null, 'included', 'countries', 'user_geo_countrys')} />
            </div>:null}
            {this.state.excluded_country ? <div className='float-container'>
              {excludedCountries.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': excludedCountries.length })} >Excluded Country</label> : <label> </label>}
              <Select placeholder="Excluded Country" style={dropdownStyle} value={excludedCountries ? excludedCountries : ['']} multiple selection search fluid name="excludedCountries" options={includedGeoCountries} onChange={this.handleSelect} onSearchChange={this.handleSearch.bind(null, 'included', 'countries', 'user_geo_countrys')} />
            </div>:null}
          </div>

          <div className='form__inside' >
          <div className='form__full' ><b>Provinces</b></div>
            <div className='form__full' > 
           <Button.Group size='tiny'>
             
             {/* <Button onClick={this.handleClick} name='none' value='none'  >{(includedProvinces.length || includedProvinces.length)  ? null : <Icon name="check" />}None</Button> */}
             {!excludedProvinces.length ?  <Button onClick={this.handleClick} name='included_province' value='included_province'  className={classNames({ 'active-flight-type': includedProvinces.length})}>{includedProvinces.length ? <Icon name="check" />:null}Included</Button>:null}
             {!includedProvinces.length ? <Button onClick={this.handleClick} name='excluded_province' value='excluded_province' className={classNames({ 'active-flight-type': excludedProvinces.length})} >{excludedProvinces.length ? <Icon name="check" />:null}Excluded</Button>:null}
           </Button.Group></div>

             {this.state.included_province ? <div className='float-container'>
              {includedProvinces.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': includedProvinces.length })} >Included Province</label> : <label> </label>}
              <Select placeholder="Included Province" style={dropdownStyle} value={includedProvinces ? includedProvinces : ['']} multiple search fluid name="includedProvinces" options={includedGeoProvinces} onChange={this.handleSelect} onSearchChange={this.handleSearch.bind(null, 'included', 'provinces', 'user_geo_provinces')} />
            </div>:null}

               {this.state.excluded_province ? <div className='float-container'>
              {excludedProvinces.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': excludedProvinces.length })} >Excluded Province</label> : <label> </label>}
              <Select placeholder="Excluded Province" style={dropdownStyle} value={excludedProvinces ? excludedProvinces : ['']} multiple search fluid name="excludedProvinces" options={includedGeoProvinces} onChange={this.handleSelect} onSearchChange={this.handleSearch.bind(null, 'included', 'provinces', 'user_geo_provinces')} />
            </div>:null}
          </div>

          <div className='form__inside' >
          <div className='form__full' ><b>DMA</b></div>
            <div className='form__full' > 
           <Button.Group size='tiny'>
             
             {/* <Button onClick={this.handleClick} name='none' value='none' >{(includedDma.length || excludedDma.length)   ? null : <Icon name="check" />}None</Button> */}
             {!excludedDma.length ?   <Button onClick={this.handleClick} name='included_Dma' value='included_Dma'  className={classNames({ 'active-flight-type': includedDma.length})}   >{includedDma.length ? <Icon name="check" />:null}Included</Button>:null}
              {!includedDma.length ?  <Button onClick={this.handleClick} name='excluded_Dma' value='excluded_Dma'  className={classNames({ 'active-flight-type': excludedDma.length})}>{excludedDma.length ? <Icon name="check" />:null}Excluded</Button>:null}
           </Button.Group>
             {this.state.included_Dma ? <div className='float-container'>
              {includedDma.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': includedDma.length })} >Included DMA</label> : <label> </label>}
              <Select placeholder="Included DMA" value={includedDma ? includedDma : ['']} style={dropdownStyle} multiple search fluid name="includedDma" options={includedGeoDma} onChange={this.handleSelect} onSearchChange={this.handleSearch.bind(null, 'included', 'dma', 'user_geo_dmas')} />
            </div>:null}
            {this.state.excluded_Dma ? <div className='float-container'>
              {excludedDma.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': excludedDma.length })} >Excluded DMA</label> : <label> </label>}
              <Select placeholder="Excluded DMA" value={excludedDma ? excludedDma : ['']} style={dropdownStyle} multiple search fluid name="excludedDma" options={includedGeoDma} onChange={this.handleSelect} onSearchChange={this.handleSearch.bind(null, 'included', 'dma', 'user_geo_dmas')} />
            </div>:null}
          </div>
          </div>

          <div className='form__inside' >
          <div className='form__full' ><b>City</b></div>
            <div className='form__full' > 
           <Button.Group size='tiny'>
             
           {/* <Button onClick={this.handleClick} name='none' value='none'  >{(includedCities.length || excludedCities.length ) ? null: <Icon name="check" />}None</Button> */}
           {!excludedCities.length ? <Button onClick={this.handleClick} name='included_city' value='included_city'  className={classNames({ 'active-flight-type': includedCities.length })}>{includedCities.length ? <Icon name="check" />:null}Included</Button>:null}
             {!includedCities.length ? <Button onClick={this.handleClick} name='excluded_city' value='excluded_city' className={classNames({ 'active-flight-type': excludedCities.length })} >{excludedCities.length ? <Icon name="check" />:null}Excluded</Button>:null}
           </Button.Group >
             {this.state.included_city ? <div className='float-container'>
              {includedCities.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': includedCities.length })} >Included City</label> : <label> </label>}
              <Select placeholder="Included City" value={includedCities ? includedCities : ['']} style={dropdownStyle} multiple selection search fluid name="includedCities" options={includedGeoCities} onChange={this.handleSelect} onSearchChange={this.handleSearch.bind(null, 'included', 'cities', 'user_geo_citys')} />
            </div>:null}
            {this.state.excluded_city ? <div className='float-container'>
              {excludedCities.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': excludedCities.length })} >Excluded City</label> : <label> </label>}
              <Select placeholder="Excluded City" value={excludedCities ? excludedCities : ['']} style={dropdownStyle} multiple selection search fluid name="excludedCities" options={includedGeoCities} onChange={this.handleSelect} onSearchChange={this.handleSearch.bind(null, 'included', 'cities', 'user_geo_citys')} />
            </div>:null}
          </div>
          </div>

          <div className='form__inside' >
          <div className='form__full' ><b>Postal Codes</b> </div>
            <div className='form__full' > 
          <Button.Group size='tiny'>
             
             {/* <Button onClick={this.handleClick} name='none' value='none'  >{(includedPostalCodes.length || excludedPostalCodes.length)  ? null: <Icon name="check" />}None</Button> */}
            {!excludedPostalCodes.length ?  <Button onClick={this.handleClick} name='included_code' value='included_code' className={classNames({ 'active-flight-type': includedPostalCodes.length })} >{includedPostalCodes.length ? <Icon name="check" />:null}Included</Button>:null}
            {!includedPostalCodes.length ?  <Button onClick={this.handleClick} name='excluded_code' value='excluded_code'  className={classNames({ 'active-flight-type': excludedPostalCodes.length })}>{excludedPostalCodes.length ? <Icon name="check" />:null}Excluded</Button>:null}
           </Button.Group>
             {this.state.included_code ? <div className='float-container'>
              {includedPostalCodes.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': includedPostalCodes.length })} >Included Postal Code</label> : <label> </label>}
              <Select placeholder="Included Postal Code" value={includedPostalCodes ? includedPostalCodes:['']} style={dropdownStyle} multiple selection search fluid name="includedPostalCodes" options={includedGeoPostalCodes} onChange={this.handleSelect} onSearchChange={this.handleSearch.bind(null, 'included', 'postalCodes', 'user_geo_postal_codes')} />
            </div>:null}
            {this.state.excluded_code ? <div className='float-container'>
              {excludedPostalCodes.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': excludedPostalCodes.length })} >Excluded Postal Code</label> : <label> </label>}
              <Select placeholder="Excluded Postal Code" value={excludedPostalCodes ? excludedPostalCodes : ['']} multiple label="Postal Code" style={dropdownStyle} selection search fluid name="excludedPostalCodes" options={includedGeoPostalCodes} onChange={this.handleSelect} onSearchChange={this.handleSearch.bind(null, 'included', 'postalCodes', 'user_geo_postal_codes')} />
            </div>:null}
          </div>
          </div>
        </div>
      </form>:null}
      </div>
    )
  }
}

const styles = {
  dropdownStyle: {
    marginBottom: "10px"
  }
};

const mapStateToProps = state => {
  const { includedCountries, excludedCountries, includedProvinces, excludedProvinces, includedDma, excludedDma, includedPostalCodes, excludedPostalCodes, includedCities, excludedCities, includedGeoCountries, excludedGeoCountries, includedGeoProvinces, excludedGeoProvinces, includedGeoDma, excludedGeoDma, includedGeoPostalCodes, excludedGeoPostalCodes, includedGeoCities, excludedGeoCities } = state.flight;

  return { includedCountries, excludedCountries, includedProvinces, excludedProvinces, includedDma, excludedDma, includedPostalCodes, excludedPostalCodes, includedCities, excludedCities, includedGeoCountries, excludedGeoCountries, includedGeoProvinces, excludedGeoProvinces, includedGeoDma, excludedGeoDma, includedGeoPostalCodes, excludedGeoPostalCodes, includedGeoCities, excludedGeoCities };
};

export default connect(mapStateToProps, { changeFlight, flightGeoSearch })(FlightGeo);
