function fetchPlaces (event = {}) {
  const placesSection = $('section.places');
  placesSection.empty();
  const data = (event.data) ? JSON.stringify(event.data) : '{}';
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    method: 'POST',
    data,
    contentType: 'application/json',
    dataType: 'json'
  }).done(function (data) {
    for (const place of data) {
      const article = $('<article></article>');
      const titleBox = $('<div class="title_box"></div>').appendTo(article);
      titleBox.append($(`<h2>${place.name}</h2>`));
      titleBox.append($(`<div class="price_by_night">$${place.price_by_night}</div>`));
      const info = $('<div class="information"></div>').appendTo(article);
      info.append($(`<div class="max_guest">${place.max_guest} Guest${(place.max_guest !== 1) ? 's' : ''}</div>`));
      info.append($(`<div class="number_rooms">${place.number_rooms} Bedroom${(place.number_rooms !== 1) ? 's' : ''}</div>`));
      info.append($(`<div class="number_bathrooms">${place.number_bathrooms} Bathroom${(place.number_bathrooms !== 1) ? 's' : ''}</div>`));
      // $(`<div class="user"><b>Owner:</b> ${ place.user.first_name } ${ place.user.last_name }</div>`, article);
      $(`<div class="description">${place.description}</div>`).appendTo(article);
      placesSection.append(article);
    }
  });
}
function main () {
  const filters = { amenities: {}, cities: {}, states: {} };
  $('.filters > div').on('change', 'li input[type="checkbox"]', function (event) {
    const $this = $(this);
    const filter = $(event.delegateTarget);
    let filterType = '';
    if (filter.is('.locations')) {
      if ($this.parents('ul').length === 2) {
        filterType = 'cities';
      } else {
        filterType = 'states';
      }
    } else {
      filterType = 'amenities';
    }
    if ($this.is(':checked')) {
      filters[filterType][$this.data('id')] = $this.data('name');
    } else {
      delete filters[filterType][$this.data('id')];
    }
    let selectedFilters;
    if (filter.is('.locations')) {
      selectedFilters = Object.values(filters.states).concat(Object.values(filters.cities));
    } else {
      selectedFilters = Object.values(filters[filterType]);
    }
    if (selectedFilters.length === 0) {
      filter.children('h4').first().html('&nbsp;');
    } else {
      filter.children('h4').first().text(selectedFilters.join(', '));
    }
  });

  $.getJSON('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });

  fetchPlaces();
  $('section.filters > button').on('click', filters, fetchPlaces);
}

$('document').ready(main);
