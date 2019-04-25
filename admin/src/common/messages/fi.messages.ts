/* eslint-disable */

const messages = {
  ra: {
    action: {
      delete: 'Poista',
      show: 'Näytä',
      list: 'Listaa',
      save: 'Tallenna',
      create: 'Luo',
      edit: 'Muokkaa',
      cancel: 'Peruuta',
      refresh: 'Päivitä',
      add_filter: 'Lisää filtteri',
      remove_filter: 'Poista filtteri',
      back: 'Takaisin',
    },
    boolean: {
      true: 'Kyllä',
      false: 'Ei',
    },
    page: {
      list: '%{name} Listaa',
      edit: '%{name} #%{id}',
      show: '%{name} #%{id}',
      create: 'Luo %{name}',
      delete: 'Poista %{name} #%{id}',
      dashboard: 'Hallintapaneeli',
      not_found: 'Ei tulosta',
    },
    input: {
      file: {
        upload_several:
          'Vedä ja pudota ladattavia tiedostoja tai valitse tiedostoja.',
        upload_single:
          'Vedä ja pudota ladattava tiedosto tai valitse tiedosto.',
      },
      image: {
        upload_several:
          'Vedä ja pudota ladattavia tiedostoja tai valitse tiedostoja.',
        upload_single:
          'Vedä ja pudota ladattava tiedosto tai valitse tiedosto.',
      },
    },
    message: {
      yes: 'Kyllä',
      no: 'Ei',
      are_you_sure: 'Oletko varma',
      about: 'About', // TODO: what should this be???
      not_found: 'Sivua ei löytynyt, tarkista URL osoite',
    },
    navigation: {
      no_results: 'Tuloksia ei löytynyt',
      page_out_of_boundaries: 'Sivu %{page} tulosten ulkopuolella',
      page_out_from_end: 'Et voi navigoida viimeisen sivun ulkopuolelle',
      page_out_from_begin: 'Sivu 1 on ensimmäinen sivu',
      page_range_info: '%{offsetBegin}-%{offsetEnd} of %{total}',
      next: 'Seuraava',
      prev: 'Edellinen',
    },
    auth: {
      username: 'Käyttäjänimi',
      password: 'Salasana',
      sign_in: 'Kirjaudu sisään',
      sign_in_error: 'Sisäänkirjautuminen epäonnistui, yritä uudestaan',
      logout: 'Kirjaudu ulos',
    },
    notification: {
      updated: 'Resurssi päivitetty',
      created: 'Resurssi luotu',
      deleted: 'Resurssi poistettu',
      item_doesnt_exist: 'Resurssia ei löydy',
      http_error: 'Ongelmia palvelimen kanssa',
    },
    validation: {
      required: 'Vaaditaan',
      minLength: 'Täytyy olla vähintään %{min} kirjainta pitkä',
      maxLength: 'Täytyy olla %{max} kirjainta tai vähemmän',
      minValue: 'Täytyy olla vähintään %{min}',
      maxValue: 'Täytyy olla %{max} tai vähemmän',
      number: 'Täytyy olla numero',
      email: 'Täytyy olla voimassaoleva sähköpostiosoite',
    },
  },
};

export default messages;
