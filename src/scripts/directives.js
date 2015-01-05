'use strict';

angular.module('lfw')
    .directive("lfwCreateLink", function() {
        return {
            restrict: 'E',
            scope: {
                href: '@'
            },
            template: [
                '<a class="btn btn-primary" href={{href}}>',
                    '<span class="glyphicon glyphicon-plus"></span> <span translate="global.actions.create"></span>',
                '</a>'
            ].join('')
        };
    })
    .directive("lfwCreateButton", function() {
        return {
            restrict: 'E',
            replace: false,
            compile: function(p_element, p_attrs) {
                if (p_attrs['className']) {
                    p_element.find('button').addClass(p_attrs['className']);
                }
            },
            template: [
                '<button class="btn btn-primary" onclick="return false;">',
                    '<span class="glyphicon glyphicon-plus"></span> <span translate="global.actions.create"></span>',
                '</button>'
            ].join('')
        };
    })
    .directive('lfwActiveMenu', function($location) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs, controller) {
                scope.location = $location;
                scope.$watch('location.path()', function(newPath) {
                    var v_link = element.find('a');
                    var v_path = v_link.attr('href');
                    v_path = v_path.substring(1); //hack because path does bot return including hashbang
                    if (v_path === newPath) {
                        element.addClass("active");
                    } else {
                        element.removeClass("active");
                    }
                });
            }
        };
    })
    .directive('lfwActiveLink', function($location) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs, controller) {
                var path = attrs.href;
                path = path.substring(1); //hack because path does bot return including hashbang
                scope.location = $location;
                scope.$watch('location.path()', function(newPath) {
                    if (path === newPath) {
                        element.addClass("active");
                    } else {
                        element.removeClass("active");
                    }
                });
            }
        };
    })
    .directive("lfwPaginationInfo", function() {
        return {
            restrict: 'E',
            replace: false,
            template: [
            '<p>',
                '<span translate="global.pagination.showing"></span>',
                ' <b>{{ (tableParams.page() - 1) * tableParams.count() + (tableParams.data.length > 0 ? 1 : 0)}} - {{ (tableParams.page() - 1) * tableParams.count() +  tableParams.data.length}}</b>',
                ' <span translate="global.pagination.of"></span>',
                ' <b>{{tableParams.total()}}</b>',
                ' <span translate="global.pagination.in_total"></span>',
            '</p>'
            ].join('')
        };
    })
    .directive("lfwFilterButton", function() {
        return {
            restrict: 'E',
            replace: false,
            template: [
                '<button class="btn btn-primary" onclick="return false;">',
                    '<i class="fa fa-search"></i> <span translate="global.actions.search"></span>',
                '</button>'
            ].join('')
        };
    })
    .directive("lfwHelpButton", function() {
        return {
            restrict: 'E',
            replace: false,
            compile: function(p_element, p_attrs) {
                if (p_attrs['text']) {
                    p_element.find('button').attr('data-content', p_attrs['text']);
                }
                if (p_attrs[' data-placement']) {
                    p_element.find('button').attr('data-placement', p_attrs['data-placement']);
                }
            },
            template: [
                '<button type="button" class="btn btn-default btn-sm" data-placement="left" data-animation="am-flip-x" data-content="" data-trigger="focus" bs-popover data-trigger="hover">',
                    '<i class="fa fa-question"></i>',
                '</button>'
            ].join('')
        }
    })
    .directive("lfwPageHeader", function() {
        return {
            restrict: 'E',
            replace: false,
            template: '<div class="page-header"><h1><i class="{{icon}}"></i>&nbsp;{{title}}</h1></div>',
            scope: {
                'icon': "@icon",
                'title': "@title"
            }
        };
    })
    .directive("lfwCheckbox", function(LfwRandom) {
            return {
                restrict: 'E',
                replace: false,
                template: [
                  '<div class="checkbox">',
                    '<label>',
                      '<input type="checkbox" ng-model="ngModel" name="{{name}}"> {{label}}',
                    '</label>',
                  '</div>'
                ].join(''),
                scope: {
                    ngModel: '=',
                    label: "@",
                    name: "@"
                }
            };
        })
    .directive("lfwTextArea", function(LfwRandom) {
        return {
            restrict: 'E',
            replace: false,
            template: [
                '<div class="form-group" show-errors>',
                    '<label class="control-label">{{label}}</label>',
                    '<div>',
                        '<textarea class="form-control" ng-model="ngModel" rows="{{rows}}"></textarea>',
                    '</div>',
                '</div>'
            ].join(''),
            scope: {
                rows: '@',
                ngModel: '=',
                label: "@",
                required: '@',
                ngMinlength: '@',
                ngMaxlength: '@',
                horizontal: '@'
            },
            compile: function(tElement, tAttrs) {
                var v_elementId = LfwRandom.string(10);

                var v_input = tElement.find('textarea');
                var v_label = tElement.find('label');

                v_input.attr("name", v_elementId).attr("id", v_elementId);
                v_label.attr("for", v_elementId);

                if (tAttrs['horizontal'])
                {
                    var v_divInput = v_input.parent();
                    v_label.addClass('col-sm-2');
                    v_divInput.addClass('col-sm-10');
                }

                var v_validationAttributes = ['required', 'ngMinlength', 'ngMaxlength'];
                angular.forEach(v_validationAttributes, function(p_validation) {
                    if (tAttrs[p_validation])
                    {
                        v_input.attr(tAttrs.$attr[p_validation], tAttrs[p_validation]);
                    }
                });
            }
        };
    })
    .directive('lfwUpperLetters', function() {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, element, attributes, ngModelCtrl) {
                ngModelCtrl.$parsers.push(function(text) {
                    var transformed = text.replace(/[^a-zA-Z]/g, '').toUpperCase();
                    if(transformed !== text) {
                        ngModelCtrl.$setViewValue(transformed);
                        ngModelCtrl.$render();
                    }
                    return transformed;
                });
            }
        }; 
    })
    .filter('zpad', function() {
        return function(input, n) {
            return input.length >= n ? input : ('0'.repeat(n) + input).slice(-1 * n);
        };
    })
    .directive('lfwDigits', function() {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, element, attributes, ngModelCtrl) {
                ngModelCtrl.$parsers.push(function(text) {
                    var transformed = text.replace(/[^0-9]/g, '');
                    if(transformed !== text) {
                        ngModelCtrl.$setViewValue(transformed);
                        ngModelCtrl.$render();
                    }
                    return transformed;
                });
            }
        }; 
    })    
    .directive("lfwInputText", function(LfwRandom) {
        return {
            restrict: 'E',
            replace: false,
            template: [
                '<div class="form-group" ng-show="ngShow" show-errors>',
                    '<label class="control-label">{{label}}</label>',
                    '<div class="lfw-group">',
                        '<input type="text" class="form-control" ng-model="ngModel" name="{{name}}">',
                    '</div>',
                '</div>'
            ].join(''),
            scope: {
                ngModel: '=',
                ngShow: '=',
                label: "@",
                required: '@',
                name: '@',
                ngMinlength: '@',
                ngMaxlength: '@',
                horizontal: '@'
            },
            compile: function(tElement, tAttrs) {
                var v_elementId = tAttrs['name'] || LfwRandom.string(10);

                var v_input = tElement.find('input');
                var v_label = tElement.find('label');
                var v_div = tElement.find('div.form-group')
                var v_divGroup = tElement.find('div.lfw-group');

                v_input.attr("name", v_elementId).attr("id", v_elementId);
                v_label.attr("for", v_elementId);

                if (tAttrs['required']) {
                    v_label.addClass("required_field");    
                }
                
                if (tAttrs['horizontal']) {
                    var v_divInput = v_input.parent();
                    v_label.addClass('col-sm-2');
                    v_divInput.addClass('col-sm-10');
                }

                if (!tAttrs['ngShow']) {
                    v_div.removeAttr('ng-show');
                }

                if (tAttrs['afterAddOn']) {
                    v_divGroup.addClass("input-group");
                    v_divGroup.append("<span class='input-group-addon'>" + tAttrs['afterAddOn'] +"</span>");
                }

                if (tAttrs['beforeAddOn']) {
                    v_divGroup.addClass("input-group");
                    v_divGroup.prepend("<span class='input-group-addon'>" + tAttrs['beforeAddOn'] +"</span>");
                }


                var v_validationAttributes = ['required', 'ngMinlength', 'ngMaxlength'];
                angular.forEach(v_validationAttributes, function(p_validation) {
                    if (tAttrs[p_validation]) {
                        v_input.attr(tAttrs.$attr[p_validation], tAttrs[p_validation]);
                    }
                });
            }
        };
    })
    .directive("lfwInputTextArea", function(LfwRandom) {
        return {
            restrict: 'E',
            replace: false,
            template: [
                '<div class="form-group">',
                    '<label class="control-label">{{label}}</label>',
                    '<div>',
                        '<textarea rows="4" class="form-control" ng-model="ngModel">',
                    '</div>',
                '</div>'
            ].join(''),
            scope: {
                ngModel: '=',
                label: "@",
                required: '@',
                ngMinlength: '@',
                ngMaxlength: '@',
                horizontal: '@'
            },
            compile: function(tElement, tAttrs) {
                var v_elementId = LfwRandom.string(10);

                var v_input = tElement.find('input');
                var v_label = tElement.find('label');

                v_input.attr("name", v_elementId).attr("id", v_elementId);
                v_label.attr("for", v_elementId);

                if (tAttrs['horizontal'])
                {
                    var v_divInput = v_input.parent();
                    v_label.addClass('col-sm-2');
                    v_divInput.addClass('col-sm-10');
                }

                if (tAttrs['required'])
                {
                    v_label.addClass("required_field");    
                }                

                var v_validationAttributes = ['required', 'ngMinlength', 'ngMaxlength'];
                angular.forEach(v_validationAttributes, function(p_validation) {
                    if (tAttrs[p_validation])
                    {
                        v_input.attr(tAttrs.$attr[p_validation], tAttrs[p_validation]);
                    }
                });
            }
        };
    })
    .directive("lfwSelectEnum", function(LfwRandom) {
        return {
            restrict: 'E',
            replace: false,
            scope: {
                ngModel: '=',
                label: "@",
                required: '@',
                attrDescriptionPrefix: '@',
                enumeration: '=',
                horizontal: '@'
            },
            compile: function (tElement, tAttrs) {
                var v_elementId = LfwRandom.string(10);

                var v_select = tElement.find('select');
                var v_label = tElement.find('label');

                v_select.attr("name", v_elementId).attr("id", v_elementId);
                v_label.attr("for", v_elementId);

                if (tAttrs['horizontal'])
                {
                    var v_divSelect = v_select.parent();
                    v_label.addClass('col-sm-2');
                    v_divSelect.addClass('col-sm-10');
                }

                if (tAttrs['required'])
                {
                    v_label.addClass("required_field");    
                }

                var v_validationAttributes = ['required'];
                angular.forEach(v_validationAttributes, function(p_validation) {
                    if (tAttrs[p_validation])
                    {
                        v_select.attr(tAttrs.$attr[p_validation], tAttrs[p_validation]);
                    }
                });
            },
            template: [
                '<div class="form-group" show-errors>',
                    '<label class="control-label">{{label}}</label>',
                    '<div>',
                        '<select class="form-control" ng-model="ngModel" ng-options="v_opt as attrDescriptionPrefix + v_opt | translate for v_opt in enumeration">',
                            '<option value=""></option>',
                        '</select>',
                    '</div>',
                '</div>'
            ].join('')
        };
    })
    .directive("lfwSelect", function(LfwRandom) {
        return {
            restrict: 'E',
            replace: false,            
            scope: {
                ngModel: '=',
                label: "@",
                required: '@',
                completeList: '=',
                attrId: '@',
                attrDescription: '@',
                horizontal: '@'
            },
            compile: function (tElement, tAttrs) {
                var v_elementId = LfwRandom.string(10);

                var v_select = tElement.find('select');
                var v_label = tElement.find('label');

                v_select.attr("name", v_elementId).attr("id", v_elementId);
                v_label.attr("for", v_elementId);

                if (tAttrs['horizontal'])
                {
                    var v_divSelect = v_select.parent();
                    v_label.addClass('col-sm-2');
                    v_divSelect.addClass('col-sm-10');
                }

                if (tAttrs['required'])
                {
                    v_label.addClass("required_field");    
                }                

                var v_validationAttributes = ['required'];
                angular.forEach(v_validationAttributes, function(p_validation) {
                    if (tAttrs[p_validation])
                    {
                        v_select.attr(tAttrs.$attr[p_validation], tAttrs[p_validation]);
                    }
                });

                if (!tAttrs['attrId'])
                {
                    tAttrs['attrId'] = 'id';
                }
                if (!tAttrs['attrDescription'])
                {
                    tAttrs['attrDescription'] = 'defaultDescription';
                }
            },
            template: [
                '<div class="form-group" show-errors>',
                    '<label class="control-label">{{label}}</label>',
                    '<div>',
                        '<select class="form-control" ng-model="ngModel" ng-options="v_opt[attrId] as v_opt[attrDescription] for v_opt in completeList">',
                        '<option value=""></option>',
                        '</select>',
                    '</div>',
                '</div>'
            ].join('')
        };
    })
    .directive("lfwPageFilter", function() {
        return {
            restrict: 'E',
            replace: false,
            transclude: true,
            template: [
                '<div class="panel panel-default">',
                    '<div class="panel-heading"><strong><i class="fa fa-filter"></i> <span translate="global.actions.filter"></span></strong></div>',
                    '<div class="panel-body">',
                        '<form role="form" name="form" novalidate class="form-horizontal"  ng-transclude>',
                        '</form>',
                    '</div>',
                '</div>'
            ].join('')
        };
    })
    .directive("lfwDeleteButton", function() {
        return {
            restrict: 'E',
            replace: true,
            compile: function(p_element, p_attrs)
            {
                if (p_attrs['className'])
                {
                    p_element.find('button').addClass(p_attrs['className']);
                }
                else {
                    p_element.find('button').addClass(' btn-sm');
                }
                if (p_attrs['onlyIcon']) {
                    p_element.find("span[translate]").remove();
                }               
            },
            scope: {
                'action': "&confirmAction",
                disable: '@'
            },
            template: [
                '<span>',
                '    <button type="button" ng-bootbox-confirm="{{\'global.actions.confirm_before_delete\' | translate}}" ng-bootbox-confirm-action="action()" class="btn btn-danger" ng-disabled="{{disable}}">',
                '        <span class="glyphicon glyphicon-trash"></span> <span class="hidden-xs hidden-sm" translate="global.actions.delete"></span>',
                '    </button>',
                '</span>'     
            ].join('')
        };
    })
    .directive("lfwButton", function() {
        return {
            restrict: 'E',
            replace: false,
            compile: function(p_element, p_attrs)
            {
                if (p_attrs['className'])
                {
                    p_element.find('button').addClass(p_attrs['className']);
                }
                else {
                    p_element.find('button').addClass('btn-sm');
                }
            },
            scope: {
                label: "@",
                icon: '@'
            },
            template: [
                '<button class="btn" type="button">',
                    '<span class="{{icon}}"></span> <span class="hidden-xs hidden-sm">{{label}}</span>',
                '</button>'
            ].join('')
        };
    })
    .directive("lfwEditButton", function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                disable: '@'
            },
            compile: function(p_element, p_attrs)
            {
                if (p_attrs['className'])
                {
                    p_element.find('button').addClass(p_attrs['className']);
                }
                else {
                    p_element.find('button').addClass(' btn-sm');
                }
                if (p_attrs['onlyIcon']) {
                    p_element.find("span[translate]").remove();
                }
            },
            template: [
                '<span>',
                '    <button class="btn" type="button" ng-disabled="{{disable}}">',
                '        <span class="glyphicon glyphicon-pencil"></span> <span class="hidden-xs hidden-sm" translate="global.actions.edit"></span>',
                '    </button>',
                'span'
            ].join('')
        };
    })
    .directive("lfwBackButton", function($window) {
        return {
            restrict: 'E',
            replace: false,
            compile: function(p_element, p_attrs)
            {
                if (p_attrs['onlyIcon']) {
                    p_element.find("span[translate]").remove();
                }
                return this.link;
            },      
            link: function(scope, element, attrs) {
               element.on('click', function() {
                $window.history.back();
                });
            },
            template: [
                '<button class="btn" type="button">',
                    '<span class="glyphicon glyphicon-chevron-left"></span> <span class="hidden-xs hidden-sm" translate="global.actions.back"></span>',
                '</button>'
            ].join('')
        };
    })
    .directive("lfwSaveSubmitButton", function() {
        return {
            restrict: 'E',
            replace: true,
            template: [
                '<button type="submit" class="btn btn-primary">',
                    '<span class="glyphicon glyphicon-save"></span> <span translate="global.actions.save"></span>',
                '</button>'
            ].join('')
        };
    })
    .directive("lfwCancelButton", function() {
        return {
            restrict: 'E',
            template: [
                '<button type="button" class="btn btn-default" data-dismiss="modal">',
                    '<span class="glyphicon glyphicon-ban-circle"></span> <span translate="global.actions.cancel"></span>',
                '</button>'
            ].join('')
        };
    })
    .directive("lfwModalHeader", function() {
        return {
            restrict: 'E',
            replace: false,
            scope: {
                title: '@'
            },
            template: [
               '<div class="modal-header">',
                    '<button type="button" class="close" data-dismiss="modal" ng-click="clear()">&times;</button>',
                    '<h4 class="modal-title">{{title}}</h4>',
                '</div>'
            ].join('')
        };
    })
    .directive("lfwModalBody", function() {
        return {
            restrict: 'E',
            replace: false,
            transclude: true,
            template: [
                '<div class="modal-body" ng-transclude>',
                '</div>'
            ].join('')
        };
    })
    .directive("lfwModalFooter", function() {
        return {
            restrict: 'E',
            replace: false,
            transclude: true,
            template: [
                '<div class="modal-footer" ng-transclude>',
                '</div>'
            ].join('')
        };
    })
    .directive("lfwPanel", function() {
        return {
            restrict: 'E',
            replace: false,
            transclude: true,
            scope: {
                headerTitle: '@'
            },
            template: [
                '<div class="panel panel-default">',
                    '<div class="panel-heading">',
                        '<h3 class="panel-title">{{headerTitle}}</h3>',
                    '</div>',
                    '<div class="panel-body" ng-transclude>',
                    '</div>',
                '</div>'
            ].join('')
        }
    })
    .directive("lfwDomainEditDialog", function() {
        return {
            restrict: 'E',
            replace: false,
            transclude: true,
            compile: function(p_element, p_attrs)
            {
                if (p_attrs['dialogId'])
                {
                    p_element.find('div.modal').attr('id', p_attrs['dialogId']);
                }
                if (p_attrs['formName'])
                {
                    p_element.find('form').attr('name', p_attrs['formName']);
                }
                if (p_attrs['saveMethod'])
                {
                    p_element.find('form').attr('ng-submit', p_attrs['saveMethod']);
                }
            },
            template: [
                '<div class="modal fade" id="domainEditDialog" tabindex="-1" role="dialog">',
                    '<div class="modal-dialog">',
                        '<div class="modal-content">',
                            '<form name="form" role="form" novalidate class="ng-scope ng-invalid ng-invalid-required ng-dirty ng-valid-minlength" ng-submit="save()" ng-transclude>',
                            '</form>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join('')
        };
    })
    .directive("lfwManyToManyCheckbox", function() {
        return {
            restrict: 'E',
            replace: false,
            scope: {
                hasFilter: '=',
                filterPlaceholder: '@',
                completeList: '=',
                selectedList: '=',
                attrId: '@',
                attrDescriptionPrefix: '@',
                attrDescription: '@',
                onAdd: '=',
                onCompare: '='

            },
            link: function(scope, element, attrs) {
                scope.onCompareAction = scope.onCompare || function(lhs, rhs) {
                    return lha[scope.attrId] === rhs[scope.attrId];
                };
                
                scope.onAddAction = scope.onAdd || function(list, option) {
                    list.push(option);
                };
                
                scope.indexOf = function(option) {
                    if (scope.selectedList)  {
                        for(var index = 0; index < scope.selectedList.length; ++index) {
                            if (scope.onCompareAction(scope.selectedList[index], option)) {
                                return index;
                            }
                        }
                    }
                    return -1;
                };
                
                scope.toggleOption = function(option) {
                    var index = scope.indexOf(option);
                    if (index != -1) {
                        scope.selectedList.splice(index, 1);
                    } else {
                        scope.onAddAction(scope.selectedList, option);
                    }
                };
            },
            compile: function(p_element, p_attrs) {
                p_attrs['attrId'] = p_attrs['attrId'] || 'id';
                p_attrs['attrDescription'] = p_attrs['attrDescription'] || 'defaultDescription';
                p_attrs['hasFilter'] = p_attrs['hasFilter'] || false;
                return this.link;
            },
            template: [
                    '<input type="text" class="form-control" placeholder="{{filterPlaceholder}}" ng-model="search[attrDescription]" ng-show="hasFilter" />',
                    '<div class="table-responsive" style="max-height: 200px; overflow-y: auto;">',
                        '<table class="table table-striped table-hover mini-list-grid" ng-show="completeList.length">',
                            '<tr ng-repeat="opt in completeList | filter:search">',
                                '<td class="no-padding">',
                                    '<div class="checkbox">',
                                        '<label class="checkbox" ng-click="toggleOption(opt)">',
                                            '<input type="checkbox" value="{{opt[attrId]}}" ng-checked="indexOf(opt) != -1">{{attrDescriptionPrefix + opt[attrDescription] | translate}}',
                                        '</label>',
                                    '</div>',
                                '</td>',
                            '</tr>',
                        '</table>',
                        '<div ng-show="completeList.length == 0">',
                            '<span translate="{{\'global.no_records_found\' | translate}}"></span>',
                            '&nbsp;&nbsp;<i class="fa fa-frown-o"></i>',
                        '</div>',
                    '</div>'
                ].join('')
        };
    })
    .directive('lfwBigListGrid', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: false,
            compile: function(element) {
                var v_cols = element.find('lfw-column');

                var v_table = '<div class="table-responsive"><table class="table table-striped table-hover" ng-table="tableParams">';

                v_table += '<colgroup>';
                for (var v_count = 0; v_count < v_cols.length; v_count++) {
                    var v_column = $(v_cols[v_count]);

                    v_table += '<col ';

                    if (v_column.attr('ng-show')) {
                        v_table += ' ng-show="' + v_column.attr('ng-show')  + '" ' ;
                    }
                    v_table += ' width="' + v_column.attr('width') + '"/>';
                }
                v_table += '</colgroup>';

                v_table += '<tbody>'
                v_table += '<tr ng-repeat="row in ' + element.attr('data-source') + '">';
                for (var v_count = 0; v_count < v_cols.length; v_count++) {
                    var v_column = $(v_cols[v_count]);

                    v_table += '<td ';

                    if (v_column.attr('class')) {
                        v_table += ' class="' + v_column.attr('class') + '" ';
                    }
                    if (v_column.attr('align')) {
                        v_table += ' align="' + v_column.attr('align') + '" ';
                    }
                    if (v_column.attr('ng-show')) {
                        v_table += ' ng-show="' + v_column.attr('ng-show')  +'" ' ;
                    }
                    if (v_column.attr('sortable')) {
                        v_table += ' sortable="' + v_column.attr('sortable') + '" ';
                    }
                    if (v_column.attr('title')) {
                        v_table += ' data-title="' + v_column.attr('title') + '" ';
                    }


                    v_table += '>'
                    if (v_column.html() != '') {
                        v_table += v_column.html();
                    } else {
                        v_table += '{{row.' + v_column.attr('value') + '}}';
                    }
                    v_table += '</td>';
                }
                v_table += '</tr>';
                v_table += '</tbody>'

                v_table += '</table></div>';
                element.append($(v_table));

                v_cols.remove();
            }
        };
    });

