var lunrIndex,
    $results,
    documents;

const maxResults = 25;
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
        });

        let urlParams = new URLSearchParams(window.location.search);
        let query = urlParams.get('keys');  

        // Pre-fill the input element with the query value.
        $('#edit-keys').attr('value', query);

        if (query.length < minQueryLength) {
          return;
        }

        let results = search(query);
        renderResults(results);        
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

  let resultsText = '';

  if (results.length > maxResults) {
    resultsText = 'Showing ' + maxResults + ' of ' + results.length + ' results';
  }
  else {
    resultsText = results.length + ' search results';
  }

  $('h2.results-title').text(resultsText).show();

  // show results up to our max defined level.
  results.slice(0, maxResults).forEach(function(result) {
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

  $("#edit-keys").keyup(function(event){    
    // empty previous results
    $results.empty();
    $('h2.results-title').hide();

    // trigger search when at least two chars provided.
    var query = $(this).val();    
    if (query.length < minQueryLength) {
      return;
    }

    var results = search(query);
    renderResults(results);
  });

}

$(document).ready(function() {
  $('h2.results-title').hide();
  initLunr();
  initUI();
});