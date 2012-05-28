// switch to testing mode
process.env.NODE_ENV = 'testing';

var utils               = require('../../lib/utils'),
    selenium_helpers    = require('../../lib/testing/selenium'),
    test_server_helpers = require('../../lib/testing/server'),
    config              = require('config'),
    async               = require('async'),
    superagent          = require('superagent');



module.exports = {

    setUp: function (setUp_done) {
        
        utils.delete_all_testing_databases( function () {
            test_server_helpers.start_server( function () {
                setUp_done();
            });            
        });
    },

    tearDown: function (tearDown_done) {
        test_server_helpers.stop_server(tearDown_done);
    },
    
    check_title: function (test) {

        var browser = selenium_helpers.new_hosting_browser();
        
        test.expect(2);
        
        browser
            .waitForTextPresent('Welcome to PopIt')
            .assertTextPresent('Welcome to PopIt')
            .testComplete()
            .end(function (err) {
                test.ifError(err);
                test.ok(true, "end of tests");
                test.done();
            });        
    },

    "check instance/notfound 404s correctly": function(test) {
      test.expect(1);
      superagent
      .get( config.hosting_server.base_url + '/instance/notfound' )
      .end(function(res){
        test.equal( res.status, 404, "Got a 404");
        test.done();
      });
    },
    
    create_instance: function (test) {
    
    
        var browser = selenium_helpers.new_hosting_browser();
        
        test.expect(2);
    
        browser
    
            // go to the create a new instance page
            .clickAndWait("link=Create your PopIt site")
    
            // submit the form check that both fields error
            .clickAndWait("css=input.btn.btn-primary")
            .assertTextPresent("Error is 'regexp'.")
            .assertTextPresent("Error is 'required'.")
    
    
            // .getHtmlSource(function (html) {
            //     console.log(html);
            // })
    
            // too short slug
            .type("id=slug", "foo")
            .clickAndWait("css=input.btn.btn-primary")
            .assertTextPresent("Error is 'regexp'.")
    
            // good slug
            .type("id=slug", "foobar")
            .clickAndWait("css=input.btn.btn-primary")
    
            // bad email
            // .type("id=email", "bob")
            // .clickAndWait('css=input[type="submit"]')
            // .assertTextPresent("Error is 'not_an_email'.")
    
            // good details
            .type("id=email", "bob@example.com")
            .clickAndWait("css=input.btn.btn-primary")
            .assertTextPresent("Nearly Done! Now check your email...")
    
            // check that the site is now reserved
            .open('/')
            .clickAndWait("link=Create your PopIt site")
            .type("id=slug", "foobar")
            .clickAndWait("css=input.btn.btn-primary")
            .assertTextPresent("Error is 'slug_not_unique'.")
    
            // check that the instance page works
            .open("/instance/foobar")
            
            // go to the last email page
            .open("/_testing/last_email")
            .clickAndWait("css=a")
    
            // on the confirm app page
            .assertTextPresent( 'choose the type of the first politician to add to the site')
            .clickAndWait("css=input[type=submit]")
    
            // .setSpeed( 10000 )
            .getLocation( function (loc) {
                test.ok( /http:\/\/foobar\./.test(loc), "loc contains http://foobar." );
            })
            .assertTextPresent( 'PopIt : foobar')
            .assertTextPresent( 'Create a new person')
            .assertTitle( 'People')
            
            // check that we are logged in
            .assertTextPresent('Hello bob@example.com')
            
            // all done
            .testComplete()
            .end(function (err) {
                if (err) throw err;
                test.ok(true, 'all tests passed');
                test.done();
            });
    
    },
    
};

