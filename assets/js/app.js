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
      currencySort: "none",
      selected: "All",
      selectCheck: false,
      res: [],
    };
  },
  computed: {
    filteArray: function () {
      this.res = this.countries.filter((item) =>
        item.name.toLowerCase().includes(this.search.toLowerCase())
      );
      if (this.sort !== "none") {
        this.currencySort = "none";
        if (this.sort) {
          this.countries.sort((a, b) => (a.name > b.name ? 1 : -1));
        } else {
          this.countries.sort((a, b) => (a.name > b.name ? -1 : 1));
        }
      }

      if (this.currencySort !== "none") {
        this.sort = "none";
        if (this.currencySort) {
          this.countries.sort(
            (a, b) => a.currencies[0].rate - b.currencies[0].rate
          );
        } else {
          this.countries.sort(
            (a, b) => b.currencies[0].rate - a.currencies[0].rate
          );
        }
      }
      if (this.selected === "All") {
        return this.countries;
      } else {
        return this.countries.filter((item) => {
          if (this.selected === item.currencies[0].code) {
            return item;
          }
        });
      }
    },
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

    countryData = totalData[0];
    ratesData = totalData[1];

    this.rates = ratesData;

    this.countries = countryData.filter((el) => {
      for (let item of ratesData) {
        if (el.currencies[0].code === item.cc) {
          el.currencies[0].rate = item.rate;
          el.currencies[0].txt = item.txt;
          el.exchangedate = item.exchangedate;
        }
        if (el.currencies[0].rate) {
          return el;
        }
      }
    });

    // console.log(this.countries);
  },
}).mount("#app");
