/**
 * Created by sungwoo on 14. 9. 5.
 */
//describe('OpenHub', function() {
//
//    it('query project', function(done) {
//        var query = 'avahi';
//        openhub.queryProject(query, function(result) {
//            console.log(result);
//            done();
//        });
//    });
//
//    it('parse project page', function(done) {
//        var testUrl = 'http://www.openhub.net/p/avahi';
//        openhub.getProjectInfo(testUrl, function(err, resp) {
//            chai.expect(resp.homepage).to.equal('http://avahi.org');
//            chai.expect(resp.licenses).to.have.length(1);
//            chai.expect(resp.licenses[0].name).to.equal('GNU Library or "Lesser" GPL');
//            chai.expect(resp.licenses[0].abbreviation).to.equal('LGPL');
//            chai.expect(resp.licenses[0].homepage).to.equal('http://www.opensource.org/licenses/lgpl-license.php');
//            done();
//        });
//    });
//
//    it('parse license page', function(done) {
//        var testUrl = 'https://www.openhub.net/licenses/lgpl';
//        openhub.getLicenseInfo(testUrl, function(err, resp) {
//            chai.expect(resp.name).to.equal('GNU Library or "Lesser" GPL');
//            chai.expect(resp.abbreviation).to.equal('LGPL');
//            chai.expect(resp.homepage).to.equal('http://www.opensource.org/licenses/lgpl-license.php');
//            done();
//        });
//    });
//
//});
//# sourceMappingURL=testOpenHub.js.map