
var should = require('should');
var List = require('../').List;

describe('list.js', function () {
  it('should ok', function () {
    var common = [
      ['选择{a}查看啥', function () {}],
      ['选择{b}查看啥', function () {}],
      ['选择{c}查看啥', function () {}]
    ];
    List.add('common', common);
    var list = List.get('common');
    list.description.should.be.equal('选择a查看啥\n选择b查看啥\n选择c查看啥');
    list.get('a').should.be.equal(common[0][1]);
    list.get('b').should.be.equal(common[1][1]);
    list.get('c').should.be.equal(common[2][1]);
  });

  it('should ok when clear', function () {
    var common = [
      ['选择{a}查看啥', function () {}],
      ['选择{b}查看啥', function () {}],
      ['选择{c}查看啥', function () {}]
    ];
    List.add('common', common);
    var list = List.get('common');
    should.exist(list);
    List.clear();
    list = List.get('common');
    should.not.exist(list);
  });

  it('should ok with string', function () {
    var common = [
      ['welcome'],
      ['选择{a}查看啥', function () {}],
      ['选择{b}查看啥', function () {}],
      ['选择{c}查看啥', function () {}]
    ];
    List.add('welcome', common);
    var list = List.get('welcome');
    list.description.should.be.equal('welcome\n选择a查看啥\n选择b查看啥\n选择c查看啥');
    list.get('a').should.be.equal(common[1][1]);
    list.get('b').should.be.equal(common[2][1]);
    list.get('c').should.be.equal(common[3][1]);
  });

  it('should ok with body, foot, delimiter', function() {
    var common = [
      ['选择{a}查看啥', function () {}],
      ['选择{b}查看啥', function () {}],
      ['选择{c}查看啥', function () {}]
    ];
    var head = '我是头';
    var delimiter = '-------';
    var foot = '我是小尾巴';

    List.add('common', common, head, delimiter, '我是小尾巴');
    var list = List.get('common');
    list.description.should.be.equal(head + '\n选择a查看啥\n' + delimiter + '\n选择b查看啥\n' + delimiter + '\n选择c查看啥\n' + foot);
    list.get('a').should.be.equal(common[0][1]);
    list.get('b').should.be.equal(common[1][1]);
    list.get('c').should.be.equal(common[2][1]);
  });

  it('should ok when run in multiple nodejs instance', function() {
    var common = [
      ['选择{a}查看啥', function () {return 'aa'}],
      ['选择{b}查看啥', function () {return 'bb'}],
      ['选择{c}查看啥', function () {return 'cc'}]
    ];
    var head = '我是头';
    var delimiter = '-------';
    var foot = '我是小尾巴';
    var req = {wxsession:{}};
    List.add('common', common, head, delimiter, foot,req);
    req.wxsession._list.should.not.be.empty;
    var list = List.unserialize(req.wxsession._list);
    list.description.should.be.equal(head + '\n选择a查看啥\n' + delimiter + '\n选择b查看啥\n' + delimiter + '\n选择c查看啥\n' + foot);
    list.get('a')().should.be.equal(common[0][1]());
    list.get('b')().should.be.equal(common[1][1]());
    list.get('c')().should.be.equal(common[2][1]());
  });
});
