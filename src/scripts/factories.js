
lfw.factory('LfwRandom', function()
{
    return {
        string: function(p_length, p_charSet)
        {
            p_charSet = p_charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            p_length = p_length || 10;
            var randomString = '';
            for (var i = 0; i < p_length; i++) {
            var randomPoz = Math.floor(Math.random() * p_charSet.length);
                randomString += p_charSet.substring(randomPoz,randomPoz+1);
            }
            return randomString;
        }
    }
})

lfw.factory('LfwDomainUtil', function()
{
    return {
        findById: function(p_id, p_list)
        {
            for (var v_count = 0; v_count < p_list.length; v_count++)
            {
                var v_domain = p_list[v_count];
                if (v_domain.id === p_id)
                {
                    return v_domain;
                }
            }
            return null;
        }
    };
});

lfw.factory('LfwFilterPageFactory', function(ngTableParams)
{
    return  {
        init: function(initialSorting, model, scope, modelVarName)
        {
            scope.applyFilter = function()
            {
                scope.tableParams.reload();
            }

            scope.clearFilter = function()
            {
                scope.filter = {};
            }
            scope.clearFilter();

            scope.save = function () {
                scope.$broadcast('show-errors-check-validity');
                if (scope.form.$valid)
                {
                    model.save(scope[modelVarName],
                        function () {
                            $('#domainEditDialog').modal('hide');
                            scope.applyFilter();
                            scope.clear();
                        });
                }
            };

            scope.isEditing = function() {
                if (scope[modelVarName] && scope[modelVarName].id) {
                    return true;
                }
                else {
                    return false;
                }
            }

            scope.edit = function (id) {
                scope[modelVarName] = model.get({id: id});
                $('#domainEditDialog').modal('show');
            };

            scope.delete = function (id) {
                model.delete({id: id},
                    function () {
                        scope.applyFilter();
                    });
            };

            scope.tableParams = new ngTableParams({
                    page: 1,            // show first page
                    count: PAGE_SIZE,           // count per page
                    sorting: initialSorting
                }, {
                total: 0,           // length of data
                counts: [], // hide page counts control
                getData: function($defer,  params)
                {
                    var keys = Object.keys(params.$params.sorting);
                    var object = {
                        page: params.$params.page,
                        count: params.$params.count,
                        sorting_field: keys[0],
                        sorting_direction: params.$params.sorting[keys[0]]
                    };
                    var filters = Object.keys(scope.filter);
                    for(var i=0; i < filters.length; i++)
                    {
                        object[filters[i]] = scope.filter[filters[i]];
                    }
                    model.query(object, function(data) {
                        if (data.content.length == 0 && data.number > 0) {
                            params.page(data.number);
                        }
                        else {
                            params.page(data.number + 1);
                            params.total(data.totalElements);
                            $defer.resolve(data.content);
                        }
                    });
                }
            });
        }
    }
  }
);
