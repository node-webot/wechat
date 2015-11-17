require('should');
var List = require('../').List;

var request = require('supertest');
var template = require('./support').template;
var tail = require('./support').tail;

var connect = require('connect');
var wechat = require('../');


beforeEach(function() {
  List.reset();
});


function initDynamicList() {
  var store = {};
  List.serializeList(function(name, list, done) {
    store[name] = list;
    return done && done(null);
  });

  List.deserializeList(function(name, done) {
    var list = store[name];
    done(null, list);
  });
};

function sendRequest(info, cb) {
  request(app)
    .post('/wechat' + tail())
    .send(template(info))
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      cb && cb(null, res);
    });
}


var app = connect();
app.use(connect.query());
app.use(connect.cookieParser());
app.use(connect.session({
  secret: 'keyboard cat',
  cookie: {
    maxAge: 60000
  }
}));
app.use('/wechat', wechat('some token', wechat.text(function(info, req, res, next) {
  // 微信输入信息都在req.weixin上
  var info = req.weixin;
  if (info.Content === 'list') {
    res.wait('view');
  } else {
    res.reply("呵呵");
  }
})));


describe('list', function() {

  it('should ok with dynamic list', function(done) {
    initDynamicList();
    List.add('view', [
      ['选择{a}查看啥', function(message, req, res) {
        res.nowait("this is answer a.");
      }],
      ['选择{b}查看啥', function() {}],
      ['回复{c}查看我的性取向', '这样的事情怎么好意思告诉你啦- -']
    ]);
    var listInfo = {
      sp: 'test',
      user: 'dynamic1',
      type: 'text',
      text: 'list'
    };

    var answerInfo = {
      sp: 'test',
      user: 'dynamic1',
      type: 'text',
      text: 'c'
    };

    sendRequest(listInfo, function(err, res) {
      nextStep();
    });
    var nextStep = function() {
      sendRequest(answerInfo, function(err, res) {
        var body = res.text.toString();
        body.should.include('这样的事情怎么好意思告诉你啦');
        done();
      });
    }
  });



  it('should okay with updated List', function(done) {
    initDynamicList();
    var listInfo = {
      sp: 'test',
      user: 'dynamic2',
      type: 'text',
      text: 'list'
    };

    var answerInfo = {
      sp: 'test',
      user: 'dynamic2',
      type: 'text',
      text: 'a'
    };

    List.add('view', [
      ['选择{a}查看啥', function(message, req, res) {
        res.nowait("this is answer a.");
      }],
      ['选择{b}查看啥', function() {}],
      ['回复{c}查看我的性取向', '这样的事情怎么好意思告诉你啦- -']
    ], "header", "...", "foot", function() {
      sendRequest(listInfo, function(err, res) {
        nextStep();
      });
    });

    var nextStep = function() {
      sendRequest(answerInfo, function(err, res) {
        var body = res.text.toString();
        body.should.include('this is answer a.');
        setTimeout(retryList, 10);
      });
    }

    function retryList() {
      List.add('view', [
        ['选择{a}查看啥', function(message, req, res) {
          res.end("this is updated answer a.");
        }],
        ['选择{b}查看啥', function() {}],
        ['回复{c}查看我的性取向', '这样的事情怎么好意思告诉你啦- -']
      ], "header", "...", "foot", function() {
        sendRequest(listInfo, function(err, res) {
          retryAnswer();
        });
      });
    }

    function retryAnswer() {
      sendRequest(answerInfo, function(err, res) {
        var body = res.text.toString();
        body.should.include('this is updated answer a.');
        done();
      });
    }
  });


  it('should get invalid list message when list is outdated', function(done) {
    initDynamicList();
    var listInfo = {
      sp: 'test',
      user: 'dynamic3',
      type: 'text',
      text: 'list'
    };

    var answerInfo = {
      sp: 'test',
      user: 'dynamic3',
      type: 'text',
      text: 'a'
    };

    List.add('view', [
      ['选择{a}查看啥', function(message, req, res) {
        res.nowait("this is answer a.");
      }],
      ['选择{b}查看啥', function() {}],
      ['回复{c}查看我的性取向', '这样的事情怎么好意思告诉你啦- -']
    ], function() {
      sendRequest(listInfo, function(err, res) {
        setTimeout(nextStep, 10);
      });
    });

    function nextStep() {
      List.add('view', [
        ['选择{a}查看啥', function(message, req, res) {
          res.end("this is updated answer a.");
        }],
        ['选择{b}查看啥', function() {}],
        ['回复{c}查看我的性取向', '这样的事情怎么好意思告诉你啦- -']
      ], "header", "...", "foot", function() {
        sendRequest(answerInfo, function(err, res) {
          var body = res.text.toString();
          body.should.include('列表已过期，请重新获取列表');
          done();
        });
      });
    }
  });

  it('should get custom invalid list message when list is outdated ', function(done) {
    initDynamicList();
    List.setInvalidListTips("New Tips.");
    var listInfo = {
      sp: 'test',
      user: 'dynamic4',
      type: 'text',
      text: 'list'
    };

    var answerInfo = {
      sp: 'test',
      user: 'dynamic4',
      type: 'text',
      text: 'a'
    };

    List.add('view', [
      ['选择{a}查看啥', function(message, req, res) {
        res.nowait("this is answer a.");
      }],
      ['选择{b}查看啥', function() {}],
      ['回复{c}查看我的性取向', '这样的事情怎么好意思告诉你啦- -']
    ], { head:"header",delimiter:",",foot:"footer"}, function() {
      sendRequest(listInfo, function(err, res) {
        setTimeout(nextStep, 10);
      });
    });

    function nextStep() {
      List.add('view', [
        ['选择{a}查看啥', function(message, req, res) {
          res.end("this is updated answer a.");
        }],
        ['选择{b}查看啥', function() {}],
        ['回复{c}查看我的性取向', '这样的事情怎么好意思告诉你啦- -']
      ], "header", "...", "foot", function() {
        sendRequest(answerInfo, function(err, res) {
          var body = res.text.toString();
          body.should.include('New Tips.');
          done();
        });
      });
    }
  });

  it('should accept user retry after invalid list', function(done) {
    initDynamicList();
    var listInfo = {
      sp: 'test',
      user: 'dynamic5',
      type: 'text',
      text: 'list'
    };

    var answerInfo = {
      sp: 'test',
      user: 'dynamic5',
      type: 'text',
      text: 'a'
    };

    List.add('view', [
      ['选择{a}查看啥', function(message, req, res) {
        res.nowait("this is answer a.");
      }],
      ['选择{b}查看啥', function() {}],
      ['回复{c}查看我的性取向', '这样的事情怎么好意思告诉你啦- -']
    ], "header", "...", "foot", function() {
      sendRequest(listInfo, function(err, res) {
        setTimeout(nextStep, 10);
      });
    });

    function nextStep() {
      List.add('view', [
        ['选择{a}查看啥', function(message, req, res) {
          res.end("this is updated answer a.");
        }],
        ['选择{b}查看啥', function() {}],
        ['回复{c}查看我的性取向', '这样的事情怎么好意思告诉你啦- -']
      ], "header", "...", "foot", function() {
        sendRequest(answerInfo, function(err, res) {
          var body = res.text.toString();
          body.should.include('列表已过期，请重新获取列表');
          retryList();
        });
      });
    }

    function retryList() {
      sendRequest(listInfo, function(err, res) {
        retryAnswser();
      });
    }

    function retryAnswser() {
      sendRequest(answerInfo, function(err, res) {
        var body = res.text.toString();
        body.should.include('this is updated answer a.');
        done();
      });
    }
  });

  it('should clear status after invalid list', function(done) {
    initDynamicList();
    var listInfo = {
      sp: 'test',
      user: 'dynamic6',
      type: 'text',
      text: 'list'
    };

    var answerInfo = {
      sp: 'test',
      user: 'dynamic6',
      type: 'text',
      text: 'a'
    };

    List.add('view', [
      ['选择{a}查看啥', function(message, req, res) {
        res.nowait("this is answer a.");
      }],
      ['选择{b}查看啥', function() {}],
      ['回复{c}查看我的性取向', '这样的事情怎么好意思告诉你啦- -']
    ], "header", "...", "foot", function() {
      sendRequest(listInfo, function(err, res) {
        setTimeout(nextStep, 10);
      });
    });

    function nextStep() {
      List.add('view', [
        ['选择{a}查看啥', function(message, req, res) {
          res.end("this is updated answer a.");
        }],
        ['选择{b}查看啥', function() {}],
        ['回复{c}查看我的性取向', '这样的事情怎么好意思告诉你啦- -']
      ], "header", "...", "foot", function() {
        sendRequest(answerInfo, function(err, res) {
          var body = res.text.toString();
          body.should.include('列表已过期，请重新获取列表');
          retryAnswser();
        });
      });
    }


    function retryAnswser() {
      sendRequest(answerInfo, function(err, res) {
        var body = res.text.toString();
        body.should.include('呵呵');
        done();
      });
    }
  });


it('should ok with object handle', function(done) {
    initDynamicList();

    var handle =  {};
    handle.action = function(message,req, res) {
      var format = require(process.cwd() + "/test/test-lib.js");
      res.reply(format(this.name) + ',这样的事情怎么好意思告诉你啦- -');
    }
    handle.name = 'king';
    List.add('view', [
      ['选择{a}查看啥', function(message, req, res) {
        res.nowait("this is answer a.");
      }],
      ['选择{b}查看啥', function() {}],
      ['回复{c}查看我的性取向', handle]
    ],function(){
      //do something after list added
    });
    var listInfo = {
      sp: 'test',
      user: 'dynamic7',
      type: 'text',
      text: 'list'
    };

    var answerInfo = {
      sp: 'test',
      user: 'dynamic7',
      type: 'text',
      text: 'c'
    };

    sendRequest(listInfo, function(err, res) {
      nextStep();
    });
    var nextStep = function() {
      sendRequest(answerInfo, function(err, res) {
        var body = res.text.toString();
        body.should.include('King,这样的事情怎么好意思告诉你啦');
        done();
      });
    }
  });


});