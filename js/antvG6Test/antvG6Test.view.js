define("antvG6Test.view", ['require','exports', 'template', 'modal.view', 'utility', 'g6', 'g6Plugins'], 
    function(require, exports, template, Modal, Utility, G6, g6Plugins) {

    var AntvG6TestView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            var tpl = '<div class="speed-measure fadeInLeft animated">' + 
                            '<h4>常用工具<small>/链路测速</small></h4>' + 
                            '<div class="well opt-ctn">' +
                                '<div id="mountNode"></div>' +  
                            '</div>' + 
                       '</div>'
            this.$el = $(tpl);

            this.data = {
              nodes: [{
                id: 'node1',
                // "x": 50,
                // "y": 100
              },{
                id: 'node2',
              }],
              edges: [{
                id: 'edge1',
                target: 'node2',
                source: 'node1',
              // "x": 250,
              // "y": 100
              }]
            };
            this.dataTree = {
                roots: [{
                    main: '主指标一',
                    value: 123111,
                    percent: '100%',
                    type: 'a',
                    children: [{
                        main: '指标 1',
                        value: 12312,
                        percent: '39%',
                        type: 'b',
                        children: [{
                            main: '指标 1.1',
                            value: 111,
                            percent: '90%',
                            type: 'a',
                        }]
                    }, {
                        main: '指标 2',
                        value: 12312,
                        percent: '79%',
                        type: 'b',
                        children: [{
                            main: '指标 2.1',
                            value: 111,
                            percent: '90%',
                            type: 'a',
                        },{
                            main: '指标 2.2',
                            value: 222,
                            percent: '90%',
                            type: 'a',
                        }]
                    }]
                }]
            };
        },

        render: function(target) {
            this.$el.appendTo(target)
            this.target = target;
            this.drawPic();
        },

        drawFun: function(item) {
            var group = item.getGraphicGroup();
            var main = item.getModel().main;
            var value = item.getModel().value;
            var percent = item.getModel().percent;
            var type = item.getModel().percent;
            var collapsed = item.getModel().collapsed;
            var children = item.getModel().children;
            var width = 100;
            var height = 50;
            var buttonWidth = 14;
            var buttonHeight = 14;
            var button = '';
            if (children && children.length > 0) {
                button = '<img class="ce-button" src=' + (collapsed ? this.expandButtonUrl : this.collapseButtonUrl) + '>';
            }
            var tpl = '<div class="card-container" style="background-color: red">' + 
                          '<h5 class="main-text">' + main + '</h5>' + 
                          '<p>' + 
                          '<span class="value-text">' + value + '</span>' +
                          '<span class="percent-text">' + percent + '</span>'
                          '</p>' + 
                       '</div>'
            var html = G6.Util.createDOM(tpl);
            var keyShape = group.addShape('dom', {
                attrs: {
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                    html: html
                }
            });
            group.addShape('dom', {
              attrs: {
                x: width / 2 - buttonWidth / 2,
                y: height - buttonHeight,
                width: buttonWidth,
                height: buttonHeight,
                html: button
              }
            });
            return keyShape;
        },

        drawPic: function(){
            G6.registerBehaviour('panNode', graph => {
              let node;
              let dx;
              let dy;
              graph.behaviourOn('node:mouseenter', () => {
                graph.css({
                  cursor: 'move'
                });
              });
              graph.behaviourOn('node:mouseleave', () => {
                graph.css({
                  cursor: 'default'
                });
              });
              graph.behaviourOn('node:dragstart', ({ item, x, y }) => {
                graph.css({
                  cursor: 'move'
                });
                const model = item.getModel();
                node = item;
                dx = model.x - x;
                dy = model.y - y;
              });
              graph.behaviourOn('node:drag', ev => {
                // graph.preventAnimate(() => {
                  graph.update(node, {
                    x: ev.x + dx,
                    y: ev.y + dy
                  });
                // });
              });
              graph.behaviourOn('node:dragend', () => {
                node = undefined;
              });
              graph.behaviourOn('canvas:mouseleave', () => {
                node = undefined;
              });
            });
            var MIN_ARROW_SIZE = 3;
            G6.registerEdge('VHV', {
                getPath: function(item) {
                    var points = item.getPoints();
                    var start = points[0];
                    var end = points[points.length - 1];
                    var hgap = Math.abs(end.x - start.x);
                    if (end.x > start.x) {
                    return [['M', start.x, start.y], ['C', start.x + hgap / 4, start.y, end.x - hgap / 2, end.y, end.x, end.y]];
                    }
                    return [['M', start.x, start.y], ['C', start.x - hgap / 4, start.y, end.x + hgap / 2, end.y, end.x, end.y]];
                },

                endArrow: {
                    path: function(item) {
                        console.log("-----------", keyShape)
                        var keyShape = item.getKeyShape();
                        var lineWidth = keyShape.attr('lineWidth');
                        lineWidth = lineWidth > MIN_ARROW_SIZE ? lineWidth : MIN_ARROW_SIZE;
                        var width = lineWidth * 10 / 3;
                        var halfHeight = lineWidth * 4 / 3;
                        var radius = lineWidth * 4;
                        return [
                            [ 'M', -width, halfHeight ],
                            [ 'L', 0, 0 ],
                            [ 'L', -width, -halfHeight ],
                            [ 'A', radius, radius, 0, 0, 1, -width, halfHeight ],
                            [ 'Z' ]
                        ];
                    },
                    shorten(item) {
                        var keyShape = item.getKeyShape();
                        var lineWidth = keyShape.attr('lineWidth');
                        return (lineWidth > MIN_ARROW_SIZE ? lineWidth : MIN_ARROW_SIZE) * 3.1;
                    },
                    style(item) {
                        var keyShape = item.getKeyShape();
                        var strokeOpacity = keyShape.attr().strokeOpacity;
                        var stroke = keyShape.attr().stroke;
                        return {
                            fillOpacity: strokeOpacity,
                            fill: stroke
                        };
                    }
                },

                startArrow: {
                    path: function(item) {
                        console.log("-----------", keyShape)
                        var keyShape = item.getKeyShape();
                        var lineWidth = keyShape.attr('lineWidth');
                        lineWidth = lineWidth > MIN_ARROW_SIZE ? lineWidth : MIN_ARROW_SIZE;
                        var width = lineWidth * 10 / 3;
                        var halfHeight = lineWidth * 4 / 3;
                        var radius = lineWidth * 4;
                        return [
                            [ 'M', -width, halfHeight ],
                            [ 'L', 0, 0 ],
                            [ 'L', -width, -halfHeight ],
                            [ 'A', radius, radius, 0, 0, 1, -width, halfHeight ],
                            [ 'Z' ]
                        ];
                    },
                    shorten(item) {
                        var keyShape = item.getKeyShape();
                        var lineWidth = keyShape.attr('lineWidth');
                        return (lineWidth > MIN_ARROW_SIZE ? lineWidth : MIN_ARROW_SIZE) * 3.1;
                    },
                    style(item) {
                        var keyShape = item.getKeyShape();
                        var strokeOpacity = keyShape.attr().strokeOpacity;
                        var stroke = keyShape.attr().stroke;
                        return {
                            fillOpacity: strokeOpacity,
                            fill: stroke
                        };
                    }
                }
            });

            G6.registerNode('card', {
                collapseButtonUrl: 'https://gw.alipayobjects.com/zos/rmsportal/GGzWwlTjflbJHmXhjMXg.svg',
                expandButtonUrl: 'https://gw.alipayobjects.com/zos/rmsportal/DzWdTiwanggjaWKwcnWZ.svg',
                draw: this.drawFun,
                // anchor: [
                //     [0.5, 0],
                //     [0.5, 1]
                // ]
            });
            var treeOption = {
                container: 'mountNode',
                height: 500,
                renderer: 'svg',
                modes: {
                    default: ['panNode']
                },
                //plugins: [new G6.Plugins['layout.dagre']()],
                layout: new G6.Layouts.CompactBoxTree({
                    // direction: 'LR', // 方向（LR/RL/H/TB/BT/V）
                    getHGap: function getHGap(){
                        // 横向间距
                        return 80;
                    },
                    getVGap: function getVGap() {
                        // 竖向间距
                        return 24;
                    },
                    direction: 'RL'
                }),
                fitView: 'tc'
            }
            //var graph = new G6.Graph(treeOption);
            var tree = new G6.Tree(treeOption);
            tree.node({
                shape: 'card'
            });
            tree.edge({
                shape: 'VHV',
                endArrow: true,
                startArrow: true
            });
            tree.on('node:click', function(ev) {
                var domEvent = ev.domEvent;
                var item = ev.item
                var target = domEvent.target;
                var collapsed = item.getModel().collapsed;
                if (target.className === 'ce-button') {
                    if (collapsed) {
                        tree.update(item, {
                            collapsed: false,
                        });
                    } else {
                        tree.update(item, {
                            collapsed: true,
                        });
                    }
                }
            });

            tree.read(this.dataTree);
        },

        onGetError: function(error){
            if (error&&error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(target) {
            this.collection.off();
            this.collection.reset();
            this.remove();
            this.initialize(this.options);
            this.render(target || this.target);
        }
    });

    return AntvG6TestView;
});