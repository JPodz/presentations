var app = angular.module("app", ['jmdobry.angular-cache']);

/**
 * The factory used for making service calls to the API. This implementation utilizes a localStorage cache, implemented
 * by the angular project at http://jmdobry.github.io/angular-cache/.
 */
app.factory('bandFactory', ['$http', '$q', '$log', '$angularCacheFactory', function ($http, $q, $log, $angularCacheFactory) {

    // Define cache factory default options. These can be overridden by each call if desired.
    var cacheFactory = $angularCacheFactory(
        'bandCache', {
            capacity: 10, // Only 10 most recent items
            maxAge: 300000, // TTL in ms
            deleteOnExpire: 'aggressive', // Once TTL expires, delete immediately
            storageMode: 'localStorage' // Use localStorage for cache
        }
    );

    return {

        /**
         * Returns all bands
         * 
         * @return  {Promise}   List of bands in success data
         */
        getAllBands: function () {

            // Since we're manually handling the cache instead of letting $http do it (allows for easier invalidation),
            // we'll need to intercept the promise and return a new one.
            var deferred = $q.defer();
            if (cacheFactory.get('bands')) {

                // If the data has been cached, use that...
                $log.debug('Got a list of bands back from cache \\m/');
                deferred.resolve(cacheFactory.get('bands'));
            } else {

                // ...otherwise, make the API call and cache the response for next time
                $http.get("http://localhost:9999/bands").success(function (data) {
                    cacheFactory.put('bands', data);
                    deferred.resolve(data);
                });
            }
            return deferred.promise;

            // It's worth noting that if you don't have invalidations that need to happen, the $http method understands
            // how to cache the data using just the options. The downside to this is that you have less control over
            // cache evictions because the key isn't defined.
            // $http.get("http://localhost:9999/bands", {cache: cacheFactory}).success(...);
        },

        /**
         * Adds a new band
         * 
         * @param   {String}    name        Band name
         * @param   {String}    bestAlbum   Best album for band
         * @return  {Promise}               The id of the inserted band in success data
         */
        addBand: function (name, bestAlbum) {

            // Invalidate the cache
            cacheFactory.remove('bands');
            return $http.post("http://localhost:9999/band", {
                name: name,
                bestAlbum: bestAlbum
            });
        },

        /**
         * Edits a band
         * 
         * @param   {Object}    band    New band data
         * @return  {Promise}           Boolean value if updated in success data
         */
        editBand: function (band) {

            // Invalidate the cache
            cacheFactory.remove('bands');
            return $http.put("http://localhost:9999/band/" + band.id, {
                name: band.name,
                bestAlbum: band.bestAlbum
            }); 
        },

        /**
         * Deletes a band with the provided id
         * 
         * @param   {String}    id      Band id
         * @return  {Promise}           Boolean value if deleted in success data
         */
        deleteBand: function (id) {

            // Invalidate the cache
            cacheFactory.remove('bands');
            return $http.delete("http://localhost:9999/band/" + id);    
        }
    };
}]);

/**
 * The base controller for the demo app. This makes the initial service request to retrieve the band data and insert it
 * into the root scope so it can be picked up and presented in the view.
 */
app.controller('controller', ['$scope', '$log', 'bandFactory', function ($scope, $log, bandFactory) {
    bandFactory.getAllBands().then(
        function success(data) {
            $scope.bands = data;
        }
    )
}]);

/**
 * The brand listing directive. This will control the edit, delete, and save actions for each of the bands. 
 */
app.directive('bandListing', ['$log', 'bandFactory', function ($log, bandFactory) {
    return {
        templateUrl: 'views/listing.html',
        link: function (scope, elem, attrs) {

            // When a band is in edit mode, we're simply setting a property of edit = true on the band's model. The view
            // picks up this change and makes the appropriate UI updates for user interaction.
            scope.editBand = function (index) {
                scope.bands[index].edit = true;
                $log.debug('Editing band:' + (index + 1));
            };

            // Removing a band sends the delete request to the service. After the call has been completed, we remove
            // that band from the scope so the UI gets updated accordingly.
            scope.removeBand = function (index) {
                $log.debug('Removing band:' + (index + 1));
                bandFactory.deleteBand(scope.bands[index].id).then(
                    function success(data) {
                        scope.bands.splice(index, 1);
                    }
                );
            };

            // Saving a band is called both edit and when a new band has been added. The only difference between these 
            // is that a new band won't yet have an id set from the database. So we can check for the id on save and make
            // the appropriate call based on its existance.
            scope.saveBand = function (index) {
                $log.debug('Saving band:' + (index + 1));
                if (scope.bands[index].id) {
                    bandFactory.editBand(scope.bands[index]).then(
                        function success(data) {
                            scope.bands[index].edit = false;
                        }
                    );
                } else {
                    bandFactory.addBand(scope.bands[index].name, scope.bands[index].bestAlbum).then(
                        function success(data) {
                            scope.bands[index].edit = false;
                        }
                    );
                }
                
            }
        }
    }
}]);

/**
 * The directive for handling a new band addition. This button registers the click event and pushes an empty model into
 * the band list in the scope in edit mode.
 */
app.directive('addBandButton', ['$log', function ($log) {
    return {
        link: function (scope, elem, attrs) {
            elem.bind('click', function () {
                scope.bands.push({
                    name: '',
                    bestAlbum: '',
                    edit: true
                });
                scope.$apply();
                $log.debug('Adding new band');
            });
        }
    }
}]);