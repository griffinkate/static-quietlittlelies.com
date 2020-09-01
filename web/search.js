var lunrIndex,
    $results,
    documents;

const maxResults = 10;
const minQueryLength = 3;

function initLunr() {
  // retrieve the index file
  $.getJSON("index.json")
    .done(function(index) {
        documents = index;

        lunrIndex = lunr(function(){
          this.ref('href')
          this.field('body')
          this.field("title", {
              boost: 10
          });

          documents.forEach(function(doc) {
            try {
              this.add(doc)
            } catch (e) {}
          }, this)
        })
    })
    .fail(function(jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
        console.error("Error getting Lunr index file:", err);
    });
}

function search(query) {
  return lunrIndex.search(query).map(function(result) {
    return documents.filter(function(page) {
      try {
        return page.href === result.ref;
      } 
      catch (e) {
        console.log('Problem searching Lunr index');
      }
    })[0];
  });
}

function renderResults(results) {
  if (!results.length) {
    return;
  }

  // show results up to our max defined level.
  results.slice(0, maxResults).forEach(function(result) {
    console.log(result);
    var $result = $('<dt class="title">');

    $result.append($('<a>', {
      href: result.href,
      text: result.title
    }));
    $results.append($result);

    var $resultbody = $('<dd>');
    $resultbody.append($('<p>', {
      class: 'search-snippet',
      text: $.trim(result.body).substring(0, 300).split(" ").slice(0, -1).join(" ") + "..."
    }));
    $results.append($resultbody);

    
  });
}

function initUI() {
  $results = $(".search-results");

  // Check for query parameter.
  let urlParams = new URLSearchParams(window.location.search);
  let query = urlParams.get('keys');  

  //$("#search-form").submit(function(event){    
    // empty previous results
    $results.empty();

    // trigger search when at least two chars provided.
    // var query = $(this).val();    
    if (query.length < minQueryLength) {
      return;
    }

    var results = search(query);
    renderResults(results);

    // event.preventDefault();
  //});
}

$(document).ready(function(){
  initLunr();
  initUI();
});