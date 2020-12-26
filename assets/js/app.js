const COUNTRY_URL = "https://restcountries.eu/rest/v2/all";
const RATES_URL =
  "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json";

Vue.createApp({
  data() {
    return {
      countries: [],
      rates: [],
      search: "",
      sort: "none",
    };
  },
  computed: {
    countriesList() {
      console.log(this.rates, this.countries);
      let res = this.countries.filter((item) =>
        item.name.toLowerCase().includes(this.search.toLowerCase())
      );
      if (this.sort !== "none") {
        if (this.sort) {
          res.sort((a, b) => (a.name > b.name ? 1 : -1));
        } else {
          res.sort((a, b) => (a.name > b.name ? -1 : 1));
        }
      }

      return res;
    },
    // someCompputedFunc() {
    //   console.log(this.rates, this.countries);
    // },
  },

  async mounted() {
    let countryData = await fetch(COUNTRY_URL);
    let ratesData = await fetch(RATES_URL);

    let total_answers = await Promise.all([countryData, ratesData]);

    total_answers = Promise.all([
      (countryData = total_answers[0].json()),
      (ratesData = total_answers[1].json()),
    ]);
    totalData = await total_answers;

    this.countries = totalData[0];
    this.rates = totalData[1];
  },
}).mount("#app");
