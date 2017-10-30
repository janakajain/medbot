(function (j$) {	
	j$.fn.addTag = function (tagOptions) {
		//create default data
		var defaults = {
			tagNode : 'a',
			tagName : '',
			tagAttr : '',
			tagEventType : 'click',
			tagType : 'static',
			eventPrefix : '',
			eventLocation : false,
			analyticType : ''	,
			customEvName:'',
			customEvValue:''
		};
		var tagOptions = j$.extend(defaults, tagOptions);	
		var tagNode = tagOptions.tagNode;
		var tagName = tagOptions.tagName;
		var tagAttr = tagOptions.tagAttr;
		var tagType = tagOptions.tagType;
		var tagEventType = tagOptions.tagEventType;
		var eventPrefix = tagOptions.eventPrefix;
		var eventLocation = tagOptions.eventLocation;
		var analyticType = tagOptions.analyticType;
		var customEvName = tagOptions.customEvName;
		var customEvValue = tagOptions.customEvValue;
		
		switch (tagType) { 
	        case 'static': 
	        	return this.find(tagNode).bind(tagEventType, function () {
					var evName = !tagName ? (tagAttr == 'html' ? j$(this).html() : j$(this).attr(tagAttr)) : tagName;
									
					switch (analyticType) { 
			        	case 'unica':
			        		if (eventPrefix) {
								evName = eventLocation ? 'evLocation=' + evName : '&evtype=' + evName;
								evName = 'ev=' + eventPrefix + '&' + evName;
							} else {
								evName = "ev=" + evName;
							}
			        		evName = customEvName ? (evName + '&' + customEvName +'='+ j$(this).attr(customEvValue)):evName;
			        		ntptEventTag(evName);
			        		break;
			        					        		
			        	default:	// unica + tealium
			        		// do 'unica' (netInSight)
			        		if (eventPrefix) {
								evName = eventLocation ? 'evLocation=' + evName : '&evtype=' + evName;
								evName = 'ev=' + eventPrefix + '&' + evName;
							} else {
								evName = "ev=" + evName;
							}
			        		evName = customEvName ? (evName + '&' + customEvName +'='+ j$(this).attr(customEvValue)):evName;
				        	ntptEventTag(evName);	
				  		        		
			        		break;
					}
				});
	        	break;
	        default:
	        	return this.delegate(tagNode, tagEventType, function () {
					var evName = !tagName ? (tagAttr == 'html' ? j$(this).html() : j$(this).attr(tagAttr)) : tagName;
				
					switch (analyticType) { 
			        	case 'unica':
			        		if (eventPrefix) {
								evName = eventLocation ? 'evLocation=' + evName : '&evtype=' + evName;
								evName = 'ev=' + eventPrefix +  evName;
							} else {
								evName = "ev=" + evName;
							}
			        		evName = customEvName ? (evName+"&"+customEvName +'='+customEvValue):evName;
			        		ntptEventTag(evName);	
			        		break;

			        	default:	// unica + tealium
			        		// do 'unica' (netInSight)
			        		if (eventPrefix) {
								evName = eventLocation ? 'evLocation=' + evName : '&evtype=' + evName;
								evName = 'ev=' + eventPrefix + '&' + evName;
							} else {
								evName = "ev=" + evName;
				   			}        	
			        		evName = customEvName ? (evName+"&"+customEvName +'='+customEvValue):evName;
			        		ntptEventTag(evName);
			        		
			        		break;
					}
				});
		}
	};
	
})(jQuery);