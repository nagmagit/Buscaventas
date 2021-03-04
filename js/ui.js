let MAX_RESULTS = 300;
let currentId = 0;

// Create query components
$.get("js/components/query.js");
$.get("js/components/result.js");

let vue = new Vue({
  el: '#app',
  data: {
    ui_searchQuery: null,
    ui_filteringQuery: null,
    queries: []
  },
  computed: {
    matching_sellers: () => {
      let matches = [];
      let queries = vue.queries;
      
      if (queries.length == 0) return 0;
      else matches = vue.get_sellers(queries[0]);
      
      for (let queryIdx in queries) {
        let query = queries[queryIdx];
        let sellers = vue.get_sellers(query);

        matches = matches.filter(e => sellers.includes(e));
      }

      return matches;
    }
  },
  methods: {
    ui_search: function(searchQuery) {
      search_mla_items(searchQuery, (results) => {
        let query = { 
          id: currentId++,
          title: searchQuery,
          results: [],
          thumbnail: null,
          min_price: 0
        };
      
        for (var i in results) {
          let result = {
            id: results[i].id,
            title: results[i].title,
            price: results[i].price,
            seller_id: results[i].seller.id,
            thumbnail: results[i].thumbnail.replace("http://", "https://"),
            condition: results[i].condition
          };
        
          // TODO: Add UI filter for condition
          if (!query.results.find((e) => e.id == result.id) && result.condition == "new") {
            query.results.push(result);
          }
          
          query.min_price = Math.min(query.min_price, result.price);
        }
      
        this.queries.push(query);
      });
    },
    sort_results_byPrice: function(query) {
      let results = [...query.results];
      
      return results.sort((a, b) => a.price - b.price);
    },
    get_sellers: function(query) {
      let sellers = [];
      let results = query.results

      for (let resultIdx in results) {
        let result = results[resultIdx];

        if (!sellers.includes(result.seller_id)) {
          sellers.push(result.seller_id);
        }
      }

      return sellers;
    }
  }
});