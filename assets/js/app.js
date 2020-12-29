const COUNTRY_URL = "https://restcountries.eu/rest/v2/all";
const RATES_URL =
  "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json";

Vue.createApp({
  data() {
    return {
      countries: [],
      rates: [],
      search: "",
      titleUp: true,
      titleDown: false,
      rateUp: "none",
      rateDown: false,
      currencySort: "none",
      selected: "All",
      selectCheck: false,
      res: [],
    };
  },
  methods: {
    titleUpActive: function () {
      this.titleUp = !this.titleUp;
      this.titleDown = !this.titleDown;
      this.rateUp = "none";
      this.rateDown = false;
    },
    titleDownActive: function () {
      this.titleDown = !this.titleDown;
      this.titleUp = !this.titleUp;
      this.rateUp = "none";
      this.rateDown = false;
    },
    rateUpActive: function () {
      this.rateUp = !this.rateUp;
      this.rateDown = !this.rateDown;
      this.titleDown = "none";
      this.titleUp = false;
    },
    rateDownActive: function () {
      this.rateDown = !this.rateDown;
      this.rateUp = !this.rateUp;
      this.titleDown = "none";
      this.titleUp = false;
    },
  },
  computed: {
    filteArray: function () {
      this.res = this.countries.filter((item) =>
        item.name.toLowerCase().includes(this.search.toLowerCase())
      );
      if (this.titleUp !== "none") {
        if (this.titleUp) {
          this.countries.sort((a, b) => (a.name > b.name ? 1 : -1));
        } else {
          this.countries.sort((a, b) => (a.name > b.name ? -1 : 1));
        }
      }

      if (this.rateUp !== "none") {
        if (this.rateUp) {
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
