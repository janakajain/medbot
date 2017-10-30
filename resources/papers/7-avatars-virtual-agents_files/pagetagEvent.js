(function (j$) {	
		j$(function () {
			
			if (!PAGE_TAGGING) {return;}
			/********** ICP Page Tagging *****************/
			j$('.tools-bookmark').addTag({tagName : 'Bookmark_Article',
				analyticType : 'unica'
			});
			j$('.tools-email').addTag({tagNode : 'span',tagAttr : 'id',
				analyticType : 'unica'
			});
			j$('.tools-print').addTag({tagName : 'Print Page',
				analyticType : 'unica'
			});
			j$('.tools-cites').addTag({tagName : 'Download Citations',
				analyticType : 'unica'
			});
			j$('.tools-refs').addTag({tagName : 'Download_Reference',
				analyticType : 'unica'
			});
			j$('.tools-rights').addTag({tagName : 'Rights_Permissions',
				analyticType : 'unica'
			});
			j$('.pdf').addTag({tagName : 'Download_PDF',
				analyticType : 'unica'
			});
			
			j$('.access-course-link').addTag({tagName : 'evAccessCourse',
				customEvName : 'lrnumber',
				customEvValue : 'data-courseid',
				analyticType : 'unica'
			});
			
			j$('.access-course-link-signin').addTag({tagName : 'evAccessCourseSignIn',
			customEvName : 'lrnumber',
			customEvValue : 'data-courseid',
			analyticType : 'unica'
			});
			
			j$('#article-nav ul').addTag({tagNode : 'li a',tagAttr : 'html',
				analyticType : 'unica'
			});
			j$('#glance-hdr .tab-menu').addTag({tagNode : 'li',tagAttr : 'id',tagType : 'dynamic',
				analyticType : 'unica'
			});
			j$('.article-hdr').addTag({tagAttr : 'href',
				analyticType : 'unica'
			});

			j$('#instSignInOptions').addTag({tagNode : 'a',tagAttr : 'html',
				analyticType : 'unica'
			});


			/********** Footer Page Tagging *****************/
			j$('.stats-footer').addTag({tagNode : 'a', tagAttr : 'html',eventPrefix : 'footerNavLinks',
				analyticType : 'unica'
			});			
			// TODO modifyMe added below line 
			j$('.stats-footer').addTag({tagNode : 'a', tagAttr : 'html',eventPrefix : 'footerNavLinks', analyticType : 'tealium'});

			
			/********** My Settings Menu Page Tagging *****************/
			j$('.stats-my-settings li').addTag({tagNode : 'a',
				tagAttr : 'id',	eventPrefix : 'mysettings',
				analyticType : 'unica',
				tagType:'dynamic'
			});
			/********** What Can I Access Tagging******************/
			j$('.stats-what-can-i-access').addTag({tagNode : 'a',
				tagName : 'WHATCANIACCESS',analyticType : 'unica',
					tagType:'dynamic'
				});
			
			/********** My Projects Menu Page Tagging *****************/
			j$('.stats-my-projects').addTag({tagNode : 'a',tagName : 'myprojects',
				analyticType : 'unica',
				tagType:'dynamic'
			});
			
			/********** Courses/ E-learning Page Tagging *****************/
			j$('.stats-course').addTag({tagNode : '.stats-course-start',tagName : 'ELEARNING_START_COURSE',
				analyticType : 'unica',
				tagType:'dynamic'
			});
			j$('.stats-course').addTag({tagNode : '.stats-course-start-nosignin',tagName : 'ELEARNING_START_COURSE_NO_WEBACCOUNT',
				analyticType : 'unica',
				tagType:'dynamic'
			});
			j$('.stats-course').addTag({tagNode : '.stats-course-view-option',tagName : 'ELEARNING_VIEW_OPTIONS',
				analyticType : 'unica',
				tagType:'dynamic'
			});
			

			/********** ToolBarWrapper Get Help Page Tagging ********************/
			j$('.stats-get-help li').addTag({tagNode : 'a', tagAttr : 'id',
				analyticType : 'unica'
			});	
			
			/********** Search Options Page Tagging *****************/
			j$('.stats-search-menu').addTag({tagNode : 'a',
				tagAttr : 'id',eventPrefix : 'Search',
				analyticType : 'unica'
			});

			/********** Browse Menu Page Tagging *****************/
			j$('.stats-browse-content  ul li').addTag({tagNode : 'a', tagAttr : 'class',
				eventPrefix : 'Browse',analyticType : 'unica',
				tagType: 'dynamic'
			});		
		
			
			/********** Meta Nav Page Tagging *****************/
			j$('.stats-metanav .stats-extLink').addTag({tagNode : 'a', tagAttr : 'class',eventPrefix : 'external link',
				eventLocation : 'true',
				analyticType : 'unica'
			});			
			j$('.stats-metanav .stats-mnEvLinks').addTag({tagNode : 'a',tagAttr : 'title',eventPrefix : 'metaNavLinks',
				analyticType : 'unica'
			});
			
			j$('.stats-metanav-signin-modal').addTag({tagNode : 'a', tagName : 'FORGOT_USERID-xplore_FORGOT_USERID_PWD_VIEW',tagNode : '.stats-forgotUserPass',
				tagType : 'static'
			});
			j$('.stats-metanav-signin-modal').addTag({tagNode : 'a', tagName : 'FORGOT_PWD-xplore_FORGOT_USERID_PWD_VIEW',tagNode : '.stats-forgotUserPass',
				tagType : 'static'
			});
				
			/********** Begin Abstract Page-Tools Page Tagging *****************/
			j$('.stats-download-citation').addTag({tagNode : 'a', tagName : 'popup-download-document-citations',
				analyticType : 'unica',
				tagType:'static'
			});
			j$('.stats-email').addTag({tagNode : 'a', tagName : 'email-article',
				analyticType : 'unica',
				tagType:'static'
			});
			
			j$('.stats-permission').addTag({tagNode : 'a', tagName : 'rightsandpermissions',
				analyticType : 'unica',
				tagType:'static'
			});
			
			j$('.stats-ppct-details').addTag({tagNode : 'a', tagName : 'EXPORT_COLLABRATEC',
				analyticType : 'unica',
				tagType:'static'
			});
			/********** End Abstract Page-Tools Page Tagging *****************/
			
			j$('.page-tools').addTag({tagNode : '#popup-download-document-citations',
				tagAttr : 'id',
				analyticType : 'unica'
			});
			j$('.page-tools').addTag({tagNode : '#rightsandpermissions',tagAttr : 'id',
				analyticType : 'unica'
			});
			j$('.page-tools').addTag({tagNode : '#popup-download-searchresult-citations',
				tagAttr : 'id',
				analyticType : 'unica'
			});
			j$('.page-tools').addTag({tagNode : '#save-this-search-button',tagAttr : 'id',
				analyticType : 'unica'
			});			
			j$('#adv-search-nav').addTag({tagNode : '#popup-search-preferences',tagName : 'preferences',
				analyticType : 'unica'
			});			
			j$('#highlights .pagination li').addTag({tagNode : 'a',tagAttr : 'id',
				eventPrefix : 'highlights',
				analyticType : 'unica'
			});			
			j$('#addToCartSpan').addTag({tagNode : 'input',
				tagAttr : 'id'
			});	
			j$('#relatedContent').addTag({tagNode : 'li',tagType : 'dynamic',tagName : 'relatedContent',
				analyticType : 'unica'
			});
			j$('#advKeywordSrch').addTag({tagName : 'advKeywordSearch',
				tagNode : 'input',
				analyticType : 'unica',
				tagType: 'dynamic'
			});	
			j$('#PubQuickSearch').addTag({tagName : 'advPubQuickSearch',
				analyticType : 'unica',
				tagType: 'dynamic'
			});	
			j$('#advCommandSearch').addTag({tagName : 'advCommandSearch',
				analyticType : 'unica',
				tagType: 'dynamic'
			});	
			
			
			/********** Roaming Page Tagging *****************/
			j$('#roamingBtnForm').addTag({tagNode : '#btn-est-roaming-signin',
				tagName : 'ESTABLISH_REMOTE_ACCESS',
				analyticType : 'unica'
			});
			j$('#roamingBtnForm').addTag({tagNode : '#btn-refresh-roaming-signin',
				tagName : 'REFRESH_REMOTE_ACCESS',
				analyticType : 'unica'
			});
		});		
	})(jQuery); 
