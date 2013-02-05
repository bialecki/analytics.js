!(function () {

    suite('KISSmetrics');

    var event = 'event';

    var properties = {
        count   : 42,
        revenue : 9.99
    };

    var userId = 'user';

    var traits = {
        name  : 'Zeus',
        email : 'zeus@segment.io'
    };


    // Initialize
    // ----------

    test('stores settings and adds kissmetrics javascript on initialize', function (done) {
        expect(window._kmq).to.be(undefined);
        var apiKey = 'bced4d55c7b0e53d1aaf683b80169bd47412c0c3';

        analytics.initialize({ 'KISSmetrics' : apiKey });

        expect(window._kmq).not.to.be(undefined);
        expect(window._kmq.push).to.equal(Array.prototype.push);
        expect(analytics.providers[0].settings.apiKey).to.equal(apiKey);

        analytics.track('Some event');
        analytics.identify('some_user');

        setTimeout(function () {

            expect(window._kmq.push).not.to.equal(Array.prototype.push);
            done();
        }, 1500);
    });


    // Identify
    // --------

    test('pushes "_identify" on identify', function () {
        var stub = sinon.stub(window._kmq, 'push');
        analytics.identify(traits);
        expect(stub.calledWith(['identify', userId])).to.be(false);

        stub.reset();
        analytics.identify(userId);
        expect(stub.calledWith(['identify', userId])).to.be(true);

        stub.reset();
        analytics.identify(userId, traits);
        expect(stub.calledWith(['identify', userId])).to.be(true);

        stub.restore();
    });

    test('pushes "_set" on identify', function () {
        var stub = sinon.stub(window._kmq, 'push');
        analytics.identify(traits);
        expect(stub.calledWith(['set', traits])).to.be(true);

        stub.reset();
        analytics.identify(userId);
        expect(stub.calledWith(['set', traits])).to.be(false);
        stub.reset();
        analytics.identify(userId, traits);
        expect(stub.calledWith(['set', traits])).to.be(true);

        stub.restore();
    });


    // Track
    // -----

    test('pushes "_record" on track', function () {
        var stub = sinon.stub(window._kmq, 'push');
        analytics.track(event, properties);
        expect(stub.calledWith(['record', event, {
            count            : 42,
            'Billing Amount' : 9.99
        }])).to.be(true);

        stub.restore();
    });


    // Alias
    // -----

    test('calls alias on alias', function () {
        var stub = sinon.stub(window._kmq, 'push');
        analytics.alias('new', 'old');
        expect(stub.calledWith(['alias', 'new', 'old'])).to.be(true);

        stub.restore();
    });

}());