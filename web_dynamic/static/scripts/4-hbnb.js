function fetchPlaces (event = {}) {
  const placesSection = $('section.places');
  placesSection.empty();
  console.log(event);
  const data = (event.data) ? JSON.stringify({amenities: Object.keys(event.data)}) : '{}';
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
  const checkedAmenities = {};
  $('.amenities li input[type="checkbox"]').on('change', function () {
    const $this = $(this);
    if ($this.is(':checked')) {
      checkedAmenities[$this.data('id')] = $this.data('name');
    } else {
      delete checkedAmenities[$this.data('id')];
    }
    if (Object.keys(checkedAmenities).length === 0) {
      $('.amenities > h4').html('&nbsp;');
    } else {
      $('.amenities > h4').text(Object.values(checkedAmenities).join(', '));
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
  $('section.filters > button').on('click', checkedAmenities, fetchPlaces);
}

$('document').ready(main);
