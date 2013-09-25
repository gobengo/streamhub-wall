define([
    'jasmine',
    'streamhub-wall',
    'streamhub-sdk',
    '../MockStream',
    'jasmine-jquery'],
function (jasmine, MediaWallView, Hub, MockStream) {
describe('A MediaWallView', function () {
	// construction behavior
    describe('can be constructed', function() {
        it ("with no options", function () {
	        var view = new MediaWallView();
        	expect(view).toBeDefined();
    	});
    	it ("with empty options", function () {
        	var view = new MediaWallView({});
        	expect(view).toBeDefined();
            expect(view._autoFitColumns).toBe(true);
    	});
	    it ("with an el", function () {
	        setFixtures('<div id="hub-MediaWallView"></div>');  
	        var view = new MediaWallView({
	            el: $('#hub-MediaWallView')
	        });
	        expect(view).toBeDefined();
	    });
        it('with .columns option', function () {
            setFixtures('<div id="hub-MediaWallView"></div>');
            var view = new MediaWallView({
                el: $('#hub-MediaWallView'),
                columns: 8
            });
            expect(view._columns).toBe(8);
            expect(view._autoFitColumns).toBe(false);
        });
	});
	
	// post construction behavior    
    describe ("after correct construction", function () {
	    var view;
        var streams;
	    
	    beforeEach(function() {
	        setFixtures('<div id="hub-MediaWallView"></div>');
	        streams = new Hub.StreamManager({main: new MockStream()});
	        view = new MediaWallView({ el: $('#hub-MediaWallView').get(0) });
            streams.bind(view);
		});
        it ("should contain 50 mock items & childViews after stream start", function () {
            streams.start();
        });
    });

    describe("when adding content with different .createdAt dates", function () {
        var view,
            startDateInt = 1375383041586,
            date1 = new Date(startDateInt),
            date2 = new Date(startDateInt + 1 * 10000),
            date3 = new Date(startDateInt + 2 * 10000),
            content1, content2, content3;
        beforeEach(function () {
            view = new MediaWallView();
            content1 = new Hub.Content({ body: 'what1' });
            content1.createdAt = date1;
            content2 = new Hub.Content({ body: 'what2' });
            content2.createdAt = date2;
            content3 = new Hub.Content({ body: 'what3' });
            content3.createdAt = date3;
            view.add(content3);
            view.add(content1);
            view.add(content2);
        });
        it("should order .contentViews by .comparator", function () {
            var sortedContentViews = view.contentViews.slice(0);
            sortedContentViews.sort(view.comparator);
            expect(view.contentViews).toEqual(sortedContentViews);
        });
    });

    describe("auto fitting columns", function () {
        var view,
            streams;

	    beforeEach(function() {
	        setFixtures('<div id="hub-MediaWallView"></div>');
	        streams = new Hub.StreamManager({main: new MockStream()});
		});

        it('calls #fitColumns() in constructor if no opts.columns specified', function () {
            spyOn(MediaWallView.prototype, 'fitColumns');

            $('#hub-MediaWallView').width(220*4); //220px is the default width of content
	        view = new MediaWallView({ el: $('#hub-MediaWallView').get(0) });
            streams.bind(view);
            view.render();
            streams.start();
            expect(view._autoFitColumns).toBe(true);
            expect(MediaWallView.prototype.fitColumns).toHaveBeenCalled();
        });

        it('calls #fitColumns() when window is resized', function () {
            $('#hub-MediaWallView').width(220*4); //220px is the default width of content
	        view = new MediaWallView({ el: $('#hub-MediaWallView').get(0) });
            streams.bind(view);
            view.render();
            streams.start();

            spyOn(view, 'fitColumns');
            $(window).trigger('resize');
            expect(view._autoFitColumns).toBe(true);
            expect(view.fitColumns).toHaveBeenCalled();
        });

        it('sets column width proportional to the media wall width', function () {
            $('#hub-MediaWallView').width(12345);
	        view = new MediaWallView({ el: $('#hub-MediaWallView').get(0), minContentWidth: 400 });
            streams.bind(view);
            view.render();
            streams.start();
            expect(view._columns).toBe(parseInt(12345/400));
        });
    });
}); 
});
