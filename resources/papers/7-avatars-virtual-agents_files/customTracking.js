// Custom Xplore Interaction Tracking

/* ntptBindEvent
    PARAMS
      event : The type of event being tracked (click, mousedown, etc.)
      func : The function to bind to the event specified in the event parameter
    
    RETURN VALUE
      Void
    
  Adds an event listener that executes the func function when the specified event
  is detected in the browser.
*/
function ntptBindEvent(event,func){
  if( (typeof(func) === "function") && document.body ){
    if( document.body.addEventListener ){
      document.body.addEventListener(event, func, true);
    }else if( document.body.attachEvent ){
    	document.body.attachEvent("on"+event, func);
    }
  }
}

/* ntptIsOnsite
    PARAMETERS
      linkHref : The URL of a link to be tested.
    
    RETURN VALUE
      Boolean : Represents whether or not the parameter URL is considered
      onsite.
    
  Checks the specified URL to determine if the current domain exists within
  the string.  If so, the URL is determined to be onsite.  Otherwise, it is
  considered offsite.
  
  NOTE: If desired, the parameter URL can also be tested against a supplied
  list of domains that should be considered onsite, or the test case can be
  modified to exclude any sub-domains.
*/
function ntptIsOnsite(linkHref){
  if( linkHref.indexOf(document.domain) > -1 ){
    return true;
  }
  return false;
}

/* ntptInitializeEvents
    PARAMETERS
      None
      
    RETURN VALUE
      Void
      
  Determines the appropriate name for the event based on browser, then binds the
  event to the ntptActivityTracking function via ntptBindEvent.
*/
function ntptInitializeEvents(){
  var e = (navigator.appVersion.indexOf("MSIE") !== -1) ? "click" : "mousedown";
  ntptBindEvent(e,ntptActivityTracking);
}

/* ntptClimbDOM
    PARAMETERS
      evt : An Event object to be crawled from.
      tag : A String representing the tagName of the desired DOM element.
      
    RETURN VALUE
      Element : The first encountered DOM element with the specified tagName.
      
  Climbs from the element that the user interacted with up through the DOM to
  the first element encountered with a tagName attribute that matches the tag
  parameter.  This function is used to grab elements relative to the user's
  interaction, such as the link, image, or containing div/fieldset for the click.
*/
function ntptClimbDOM(evt,tag){
  var e=evt.target||evt.srcElement;
  while( e.tagName && (e.tagName.toLowerCase() !== tag.toLowerCase()) ){
    e=e.parentElement||e.parentNode;
  }
  return e;
}

/* ntptActivityTracking
    PARAMETERS
      evt - The Event object created from the user's interaction.
      
    RETURN VALUE
      Void
      
  This function contains all of the logic that determines how to handle each
  click on the website.  In general, the code climbs from the click Event object
  to nearby DOM elements, determining whether or not an image should be created based
  on various attributes such as:
  
    * id
    * href
    * className
    
  If a particular DOM element matches the logic, steps are taking to parse information out
  of the surrounding DOM environment to pass into the web analytics solution.
  
  NOTE: Much of the logic is susceptible to changes in attribute naming and DOM structure.
  If a new version of the site is released, this code needs to be re-tested to confirm that
  it still functions properly.
*/
function ntptActivityTracking(evt){
  evt = evt || window.event ;
  if( (evt !== null && typeof evt !== undefined) || 
    (((typeof(evt.which) === "number") && 
    		(evt.which === 1 || evt.which === 2 || evt.which === 3)) ||
    		((typeof(evt.button) === "number") && 
    				(evt.button === 1 || evt.button === 2 || evt.button === 4))) ){
    var a = ntptClimbDOM(evt,"A");
    if( a !== null && typeof a.href !== "undefined" ){
      var linkHref = a.href,
          lcLinkHref = linkHref.toLowerCase();
      // Highlight Tracking
      var idMatch = (typeof a.id === "string") ? a.id.match(/(highlight\d)-link\d/) : null;
      if( idMatch !== null ){
        var clickedHighlight = document.getElementById(idMatch[1]),
            titleElement = clickedHighlight.getElementsByTagName("H3")[0],
            titleText = titleElement.innerText || titleElement.textContent || "Unknown Title";
        ntptCallEvent("ev=HighlightClick&highlight="+titleText.replace(/^\s*|\s*$/,""));
      }
      // Exit Link Tracking
      if( !ntptIsOnsite(linkHref) ){
        ntptCallEvent("ev=ExitLink&exitlink="+escape(lcLinkHref));
      }
      // Index Terms Tracking
      if( typeof a.id === "string" && a.id.match(/Index Term \d{1,3}/) ){
        var parentLI = ntptClimbToParent(a,"li"),
            sectionTitle = (parentLI !== null) ? parentLI.getElementsByTagName("B")[0].innerHTML : "Unknown";
        ntptCallEvent("ev=IndexTermsClick&indextermclick="+a.innerHTML.replace(/\<span[^\>]*\>|\<\/span\>/g,"").replace(/^\s+|\s+$/g,"")+"&indextermcat="+sectionTitle);
      }
      // Add to Filing Cabinet Tracking
      if( lcLinkHref.match(/addtofilecabinet/) !== null ){
        var arnumber = ntptParseQueryParameter(linkHref, "arnumber");
        ntptCallEvent("ev=FileCabinetStore&file="+arnumber);
      }
      // Download from Filing Cabinet Tracking
      if( document.location.pathname.toLowerCase().match(/filecabinet[^\.]*.jsp/) !== null &&
          lcLinkHref.indexOf("stamp.jsp") > -1 ){
        var arnumber = ntptParseQueryParameter(linkHref, "arnumber");
        ntptCallEvent("ev=FileCabinetDownload&file="+arnumber);
      }
    }
    // Advanced Search Tracking
    var input = ntptClimbDOM(evt,"INPUT");
    if( input !== null && typeof input.id === "string" && input.id.toLowerCase().indexOf("submit-selections") > -1 ){
      var fieldsets = document.getElementsByTagName("FIELDSET"), numFieldsets = fieldsets.length;
      var query = ntptGetAdvancedSearchQuery(fieldsets, numFieldsets),
          filterCats = ntptGetFilterCategories(fieldsets, numFieldsets);
      ntptCallEvent("ev=AdvancedSearch&advsearchphrase="+query+"&advsearchfilters="+filterCats);
    }
    // Citation Tracking
    var img = ntptClimbDOM(evt,"IMG");
    if( img !== null && typeof img.id !== "undefined" ){
      var citations = "",
          parseParam = "";
      if( img.id === "popup-download-document-citations" ){
        parseParam = "abstract";
      } else if( img.id.match(/popup-download-[^-]*-citation/) ){
        parseParam = "contents";
      }
      if( parseParam !== "" ){
        citations = ntptParseCitationArticleNumber(parseParam);
      }
      if( citations !== "" ){
        ntptCallEvent("ev=CitationClick&file="+citations);
      }

     }

    // Search Facet Tracking
    var fieldset = ntptClimbDOM(evt,"FIELDSET");
    if( fieldset !== null && fieldset.className && fieldset.className.toLowerCase().indexOf("search-refine") > -1 &&
        input !== null && input.alt && input.alt.toLowerCase().match(/results$/) ){
      var facettype = fieldset.id,
          facetdetail = "";
      facettype = (typeof facettype !== "undefined") ? facettype : "Unknown Type";
      facetdetail = ntptParseSearchFacetDetail(facettype, fieldset);
      ntptCallEvent("ev=SearchFacetClick&facettype="+facettype+"&facetdetail="+facetdetail);
    }
  }
}

function ntptClimbToParent(element,parentTagName){
  while(element.tagName && (element.tagName.toLowerCase() !== parentTagName.toLowerCase())){
    element = element.parentNode||element.parentElement;
  }
  return element;
}

/* ntptParseSearchFacetDetail
    PARAMETERS
      facettype : The String representing the parsed search facet that is being used
        to filter search results.
      fieldset : The DOM Element object corresponding to the fieldset that houses the
        interaction.
      
    RETURN VALUE
      String : The parsed details of the search refinement, including all of the
        different refinements under the specified type.  If the type was unable
        to be parsed, an empty string is returned.
      
  This helper function takes the parsed search facet type and performs logic based
  on whether or not the type corresponds to the Publication Year filter.  If so, the
  fieldset is parsed for the year range that the user specified to filter.  Otherwise,
  the comma-separated list of filters checked by the user will be returned.
*/
function ntptParseSearchFacetDetail(facettype, fieldset){
  if( facettype !== "Unknown Type" ){
    if( facettype === "Publication Year" ){
      var inputs = fieldset.getElementsByTagName("INPUT"), i, numInputs = inputs.length,
          startYear = "", endYear = "";
      for( i = 0; i < numInputs; i++ ){
        if( inputs[i].id.toLowerCase() === "text_startyear" ){
          startYear = inputs[i].value+"";
        }
        if( document.getElementById("radio_range").checked && inputs[i].id.toLowerCase() === "text_endyear" ){
          endYear = "-"+inputs[i].value;
        }
      }
      return startYear + endYear;
    } else {
      var ulists = document.getElementsByTagName("UL"),
          selectedRefinements = "", i, numULists = ulists.length,
          facetdetail = "";
      for( i = 0; i < numULists; i++ ){
        if( ulists[i].className.toLowerCase() === "selections" ){
          var spans = ulists[i].getElementsByTagName("SPAN"), j, numSpans = spans.length;
          for( j = 0; j < numSpans; j++ ){
            if( spans[j].className.toLowerCase() === "refinement" ){
              facetdetail += "," + escape(spans[j].innerHTML.replace(/\s\s+|\<[^\>]*\>|\([^\)]*\)|,|amp\;/g,""));
            }
          }
        }
      }
      return (facetdetail !== "") ? facetdetail.substring(1) : "";
    }
  }
  return "";
}

/* ntptParseQueryParameter
    PARAMETERS
      queryString : A String representing the query string to be parsed for a
        particular parameter.
      queryParam : A String representing the specific query parameter whose
        value needs to be parsed from the specified queryString.
      
    RETURN VALUE
      String : Represents the value of the parameter found in the query string.
      
  This helper function parses through a URL, looking for the specified queryParam
  within the specified queryString.  If found, it returns the value of the queryParam.
  Otherwise, the empty string is returned.
*/
function ntptParseQueryParameter(queryString, queryParam){
    var queryStringMatch = queryString.match(new RegExp(queryParam+"=([^&#]*)","i"));
    if( queryStringMatch !== null ){
        return queryStringMatch[1];
    }
    return "";
}

/* ntptParseCitationArticleNumber
    PARAMETERS
      parseParam : A String representing a custom value that determines which
        logic the function should apply to finding the appropriate article numbers.
      
    RETURN VALUE
      String : A single article number, or a comma-separated list of article numbers
        for which the user downloaded citations.
      
  This helper function first uses the specified parseParam to determine if it should
  behave for an abstract page or for a contents listing.  Then, the appropriate logic
  is utilized to return either a single article number pertaining to the abstract, or
  a comma-separated list of article numbers for each article checked within a contents 
  listing.
  
  As a default case, the empty string is returned.
*/
function ntptParseCitationArticleNumber(parseParam){
  if( parseParam === "abstract" ){
    return ntptParseQueryParameter(document.location.search, "arnumber");
  }else if( parseParam === "contents" ){
    var ulists = document.getElementsByTagName("UL"), numULists = ulists.length,
        citations = "", i, j;
    for(i = 0; i < numULists; i++){
      if( ulists[i].className === "Results" ){
        var results = ulists[i].getElementsByTagName("LI"), numResults = results.length;
        for(j = 0; j < numResults; j++){
          var checkbox = results[j].getElementsByTagName("INPUT")[0];
          if(typeof checkbox !== "undefined" && checkbox.checked){
            //citations += "," + ntptParseQueryParameter(results[j].getElementsByTagName("A")[0].href, "arnumber");
            citations += "," + checkbox.id;
          }
        }
        return citations.substring(1);
      }
    }
  }
  return "";
}

/* ntptGetAdvancedSearchQuery
    PARAMETERS
      fieldsets : An Array of parsed fieldset DOM Elements on the page.
      numFieldSets : The pre-calculated length of the fieldsets Array.
      
    RETURN VALUE
      String : The concatenated advanced search phrase based on all of
        the populated fields, including the corresponding conditionals.
      
  This helper function identifies the fieldset DOM Element that contains
  the advanced search phrase input boxes, then parses through them to
  determine what the user's phrase is, including conditionals beside the
  appropriate terms for each input box.
  
  If the appropriate fieldset is not found, the empty string is returned.
*/
function ntptGetAdvancedSearchQuery(fieldsets, numFieldsets){
  for( var i = 0; i < numFieldsets; i++ ){
    if( fieldsets[i].className === "primary-fields" ){
      var inputs = fieldsets[i].getElementsByTagName("INPUT"), numInputs = inputs.length, j,
          query = inputs[0].value;
      for( j = 1; j < numInputs; j++ ){
        var currentValue = inputs[j].value;
        if( currentValue !== "" ){
          var conditional = (query !== "") ? " " + document.getElementById("searchconditional_"+(j+1)).value + " " : "";
          query += conditional + currentValue;
        }
      }
      return query;
    }
  }
  return "";
}

/* ntptGetFilterCategories
    PARAMETERS
      fieldsets : An Array of parsed fieldset DOM Elements on the page.
      numFieldSets : The pre-calculated length of the fieldsets Array.
      
    RETURN VALUE
      String : A comma-separated list of the advanced search filter
        categories that the user included in his or her search.
      
  This helper function parses through the fieldsets on the page,
  identifying those that contain advanced search filter categories and
  determining which the user interacted with to further refine the
  advanced search results.  If any interactions were identified, the
  categories that were utilizied are returned in a comma-separated list.
*/
function ntptGetFilterCategories(fieldsets, numFieldsets){
  var filterCats = "";
  for( var i = 0; i < numFieldsets; i++ ){
    if( typeof fieldsets[i].id === "string" ){
      var fieldsetMatch = fieldsets[i].id.toLowerCase().match(/as-.*/);
      if( fieldsetMatch !== null ){
        var filterInputs = fieldsets[i].getElementsByTagName("INPUT"), numInputs = filterInputs.length,
            foundFilter = false, j;
        for( j = 0; j < numInputs && !foundFilter; j++ ){
          if( filterInputs[j].checked ){
            var currentFilterCat = fieldsets[i].getElementsByTagName("A")[0].innerHTML;
            if( currentFilterCat === "Publication Year" ){
              var label = filterInputs[j].parentNode || filterInputs[j].parentElement;
              if( label.innerHTML.indexOf("All Available Years") === -1 ){
                filterCats += currentFilterCat + ",";
                foundFilter = true;
              }
            } else {
              filterCats += currentFilterCat + ",";
              foundFilter = true;
            }
          }
        }
      }
    }
  }
  return filterCats.substring(0,filterCats.length-1);
}

/* ntptIdentifyHighlightLinks
    PARAMETERS
      None
      
    RETURN VALUE
      Void
      
  This helper function parses through the page, identifying any links that live
  within the Highlight advertisement functionality.  For each highlight, all of
  its child links are provided an ID based on the highlight Element's ID and the
  number of links living under the highlight.
  
  This functionality is used to better identify the highlight that the user
  interacted with in the ntptActivityTracking function.
*/
function ntptIdentifyHighlightLinks(){
  var i = 1, j, highlight = document.getElementById("highlight"+i), links = [], numLinks = 0;
  while( highlight !== null ){
    links = highlight.getElementsByTagName("A");
    numLinks = links.length;
    for( j = 0; j < numLinks; j++ ){
      links[j].id = "highlight"+i+"-link"+j;
    }
    highlight = document.getElementById("highlight"+(++i));
  }
}

/* ntptIdentifyIndexTerms
    PARAMETERS
      None
      
    RETURN VALUE
      Void
      
  This helper function parses through the abs_all.jsp page to identify all of
  the index terms that exist.  Each term is given an ID corresponding to their
  order of discovery, which is used to easily identify whether a term was clicked
  within the ntptActivityTracking function.
*/
/*function ntptIdentifyIndexTerms(){
  if( document.location.pathname.indexOf("abs_all.jsp") > -1 ){
    var links = document.getElementsByTagName("A"), numLinks = links.length, i, indexTermElem = null;
    for( i = 0; i < numLinks && indexTermElem === null; i++ ){
      if( links[i].name === "Index Terms" ){
        indexTermElem = links[i];
      }
    }
    var indexTermSection = indexTermElem.parentNode.parentNode,
        indexTermLinks = indexTermSection.getElementsByTagName("A"),
        numIndexTermLinks = indexTermLinks.length,
        indexTerms = (numIndexTermLinks > 0) ? indexTermLinks[0].innerHTML : "";
    for( i = 1; i < numIndexTermLinks; i++ ){
      indexTerms += "," + indexTermLinks[i].innerHTML;
      indexTermsLinks[i].id = "Index Term " + i;
    }
  }
}*/
function ntptIdentifyIndexTerms(){
  var indexTermDiv = document.getElementById("index-terms");
  if( indexTermDiv !== null ){
    var indexTermContainer = indexTermDiv.parentNode||indexTermDiv.parentElement,
        indexTermLinks = indexTermContainer.getElementsByTagName("A"), 
        numIndexTerms = indexTermLinks.length, i;
    for( i = 0; i < numIndexTerms; i++ ){
      indexTermLinks[i].id = "Index Term "+i;
    }
  }
}

/* ntptSetSessionCookie
    PARAMETERS
      name : A String representing the desired name for the cookie.
      value : The desired value for the cookie.
      
    RETURN VALUE
      Void      
  
  This helper function creates a new cookie within the browser that is set to
  expire after 30 minutes.
*/
function ntptSetSessionCookie(name, value) {
  var currentDate = new Date();
	var expirationDate = new Date(currentDate.getTime()+1800000);
  var newCookie = name+"="+value+"; expires="+expirationDate.toGMTString()+"; domain=.ieee.org; path=/;";
  document.cookie = newCookie;
}

/* ntptGetCookie
    PARAMETERS
      c_name : A String representing the desired name for the cookie.
      
    RETURN VALUE
      String : Represents the value of the specified cookie crumb.     
  
  This helper function pulls the value of a cookie from the browser.  If the
  specified name of the cookie crumb was not found, the empty string is returned.
  
  The code was snipped from an example on W3Schools at:
    http://www.w3schools.com/js/js_cookies.asp
*/
function ntptGetCookie(c_name){
  var i,x,y,ARRcookies=document.cookie.split(";");
  for (i=0;i<ARRcookies.length;i++){
    x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
    y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
    x=x.replace(/^\s+|\s+$/g,"");
    if (x==c_name){
      return unescape(y);
    }
  }
  return "";
}

/* ntptCallEvent
    PARAMETERS
      paramString : A String representing the query string to be appended onto
        the NetInsight page tag image request.
      msDelay : A Number representing the desired time to delay the browser's
        next action to allow the NetInsight image request to fire successfully.
      
    RETURN VALUE
      Void      
  
  This wrapper function allows a time delay to be easily added to any ntptEventTag
  calls.  If no delay is specified, the browser continues as normal after the
  ntptEventTag function returns.  Otherwise, the browser will poll on the JavaScript
  while the image request completes.
  
  A delay is typically only necessary within FireFox for those clicks that load new
  content directly over the same tab.  It should also be appropriately set as to not
  negatively impact the user experience.  As a start, 200 ms is generally long enough
  for the request to be made, but short enough to not make the user impatient.
*/
function ntptCallEvent(paramString, msDelay){
  ntptEventTag(paramString);
  if( typeof msDelay === "number" ){
    var currentDate = null,
        startDate = new Date();
    do{ currentDate = new Date(); }
    while( currentDate - startDate < msDelay ); 
  }
}

/* ntptTrackStartAndEndTimes
    PARAMETERS
      None
      
    RETURN VALUE
      String : A page tag parameter String including the visit start and end
        times as necessary.
  
  This function identifies whether or not a visitstart cookie has already been
  set to signal a new visit.  If not, the visitstart parameter is added to the
  return string.  Otherwise, the cookie is refreshed, and the visitend parameter
  is added to the return string on each view.  The NetInsight interface will be
  configured to parse the parameter at the Visit level, taking the last value
  seen in the visit.
  
  The format of the time has been set to:  HH:MM.  If necessary, the commented
  line can be substituted for its uncommented assignment counterpart to change
  this format to the hour range that contained the visit start/end.
*/
function ntptTrackStartAndEndTimes(){
  var returnString = "", 
      currentDate = new Date(),
      formatTime = function(num){
        return (num < 10) ? "0"+num : num;
      },
      //formattedDate = formatTime(currentDate.getHours()) + ":00 - " + formatTime(((currentDate.getHours()+1)%24)) + ":00";
      formattedDate = formatTime(currentDate.getHours()) + ":" + formatTime(currentDate.getMinutes());
  if( ntptGetCookie("visitstart") === "" ){
    returnString += "&visitstart=" + formattedDate;
  }
  ntptSetSessionCookie("visitstart", formattedDate);
  returnString += "&visitend=" + formattedDate;
  return returnString;
}

/* ntptIdentifySearchFacets
    PARAMETERS
      None
      
    RETURN VALUE
      Void     
  
  This helper function parses through the page, identifying the various search
  facets that can be used to refine a user's search results.  The fieldset
  containers for these facets are given IDs that match the titles of the facets
  themselves, allowing for easy tracking within the ntptActivityTracking
  function.
*/
function ntptIdentifySearchFacets(){
  var divs = document.getElementsByTagName("DIV"), numDivs = divs.length, i;
  for( i = 0; i < numDivs; i++ ){
    if( divs[i].className.toLowerCase().indexOf("section separator dhtml") > -1 ){
      var divLinks = divs[i].getElementsByTagName("A"), numDivLinks = divLinks.length, j;
      for( j = 0; j < numDivLinks; j++ ){
        if( divLinks[j].className.toLowerCase().indexOf("revealcontrol") > -1 ){
          var divFieldsets = divs[i].getElementsByTagName("FIELDSET"), numDivFieldsets = divFieldsets.length, k;
          for( k = 0; k < numDivFieldsets; k++ ){
            if( divFieldsets[k].className.toLowerCase().indexOf("search-refine") > -1 ){
              divFieldsets[k].id = divLinks[j].innerHTML;
            }
          }
        }
      }
    }
  }
}

function ntptTestFileCabFull(){
  if( document.location.pathname.toLowerCase().match(/filecabinetfull.jsp/) ){
    var arnumber = ntptParseQueryParameter(document.location.search, "arnumber");
    ntptCallEvent("ev=FileCabFull&file="+arnumber);
  }
}

var NTPT_PGEXTRA = NTPT_PGEXTRA || "";

setTimeout(ntptInitializeEvents,300);
setTimeout(ntptIdentifyHighlightLinks,300);
setTimeout(ntptIdentifySearchFacets,300);
setTimeout(ntptIdentifyIndexTerms,300);
setTimeout(ntptTestFileCabFull,300);
NTPT_PGEXTRA += ntptTrackStartAndEndTimes();