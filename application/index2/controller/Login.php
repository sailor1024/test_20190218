<?php

namespace app\index2\controller;

use app\common\Token;
use app\index2\model\User as ModelUser;
use app\index2\model\Login as ModelLogin;
use think\Db;
vendor('message.CCPRestSmsSDK');
/*
    该控制器的方法都是不需要token验证
*/

class Login extends Base {
    public function __construct()
    {

    }


    /*
    用户注册
    @url /index/user/user_register（没有直接调用）
    */
    /* public function user_register() {
        $entity = input("param.");

        try {
            $rs_data = model('Login')->user_register($entity);
            $result = $rs_data;
        } catch (\Exception $e) {
            $result['message'] = $e->getMessage();
            $result['code'] = '402';
        }

        $this->json_msg($result);


    } */

    /* 
    公司注册
    @url /index/user/company_register
    */
    public function company_register() {
        $entity = input("param.");

        try {
            $rs_data = model('Login')->company_register($entity);
            $result = $rs_data;
        } catch (\Exception $e) {
            $result['message'] = $e->getMessage();
            $result['code'] = '402';
        }

        $this->json_msg($result);
    }

    /* 
    邀请注册
    */
    public function invite_register() {
        $entity = input("param.");

        try {
            $rs_data = model('Login')->invite_register($entity);
            $result = $rs_data;
        } catch (\Exception $e) {
            $result['message'] = $e->getMessage();
            $result['code'] = '402';
        }

        $this->json_msg($result);
    }

    /*
   用户登录
   @url /index/user/user_login
   */
    public function user_login(Token $token) {
        $entity = input("param.");
        $entity['my_time'] = date("Y-m-d H:i:s");
        //cache("entity", $entity);
        try {
            $param = [];
            $result = model('Login')->user_login($entity);
            
            if ($result['code'] == 200) {
                $param['where']['token'] = $result['data']['token'];
                $_result = $token::setUserTonken($param);
                
                if ($_result['code'] != 200) {
                    $result['message'] = lang('message400');
                    $result['code'] = 400;
                    $this->json_msg($result);
                }
            }
        } catch (\Exception $e) {
            $result['message'] = $e->getMessage();
            $result['code'] = '401';
        }
        
        $this->json_msg($result);
    }

    /**
     * 手机登录
     */
    public function phone_login(Token $token, ModelUser $user,ModelLogin $login) {
        /* echo md5('13800138000'); //7945bd83237335e5376ff44d62e4f0ae
        exit; */
        $entity = input("param.");
        $phone_code = $entity['phone_code']; //MD5
        //cache("entity", $entity);
       // echo md5('13800138000');
       // echo sha1(md5('13800138000'));
      // echo sha1('7945bd83237335e5376ff44d62e4f0ae');
      //  exit;
      
        try {
            $result['code']=202;
            $login_param = [];
            $login_param['where']['phone'] = sha1($entity['phone']);//数据库中的加密手机号码
            $login_param['where']['verify_code_type'] = 1; //1 是手机登录
            $get_code = Db::name('verify_code')->where( $login_param['where'] )->order('final_time','desc')->find();
            
            if (empty($get_code)) { //没有验证码
                $result['message'] = lang('message400');
                $result['code'] = 400;
                $this->json_msg($result);
            } else {

                if($get_code['error_num'] >  10){
                    $result['message'] = '验证错误过多，请重新获取!';
                    $result['code'] = 202;
                    $this->json_msg($result);
                }else if ($get_code['phone_code'] != $phone_code) { //前端验证码与数据库的验证码不一致
                    $new_error_num = intval($get_code['error_num']) + 1;
                    Db::name('verify_code')->where('id',$get_code['id']  )->update(['error_num'=>$new_error_num ]); //验证码输入错误次数加 1 
                    $result['message'] = '验证码不一致!';
                    $result['code'] = 202;
                    $this->json_msg($result);
                } elseif ($get_code['final_time'] < time()) { //验证码时间过期
                    $result['message'] = '时间过期!';
                    $result['code'] = 202;
                    $this->json_msg($result);
                }
            }
           // $get_token_param['user_id'] = 
           
            $_param = [];
            $_param['where']['phone'] = $login_param['where']['phone'] ;
            $_param['field'] = ['id,user_type,company_id,father_id,lastname,firstname,decrypt_email,decrypt_phone,is_use,head_photo_url'];
            $getUser = $user->getArr($_param);//通过md5后的手机号码去获取用户信息
            $find_user = [];
            if ($getUser['code'] == 200) {

                if ($getUser['info']['is_use'] != 1) { //该号码被管理员虚拟删除
                    $result['code'] = 202; 
                    $result['message'] = '账号异常！'; 
                    $this->json_msg($result);
                }
                    
                    $param = [];
                    $param['user_id'] = $getUser['info']['id'];
                    $param = $login->setToken($param);

                    if ($param['code'] != 200) {
                        $result['code'] = '401';
                        $result['message'] = lang('message401');
                        $result['data'] = [];
                        $this->json_msg($result);
                    }

                    $token = $param['info'];
                    $find_user = $getUser['info'];
                    //添加token放回给前端
                    $find_user['token'] = $token;
                    unset($find_user['is_use']);
                    $param_set_user = [];
                    $param_set_user['where']['token'] = $token;
                    $_result = Token::setUserTonken($param_set_user);

                    if ($_result['code'] != 200) {
                        $result['message'] = lang('message400');
                        $result['code'] = 400;
                        $this->json_msg($result);
                    }

                    $company_message=Db::name('company')->where('id',$find_user['company_id'])->field('company_name')->find();
                    
                    if ($company_message) {
                        $find_user['company_name'] = $company_message['company_name'];
                    } else {
                        $find_user['company_name'] = '';
                    }

                    $result = array(
                        'data'=>200,
                        'data'=>$find_user,
                        'message'=>'登录成功！！！'
                    );
                
            }else{
                $result['message'] = '该手机号码账号不存在!';
                $result['code'] = 202;
                $this->json_msg($result);
            }
            
        } catch (\Exception $e) {
            $result['message'] = $e->getMessage();
            $result['code'] = '401';
        }

        $this->json_msg($result);
    }

    /*
   用户退出登录 //传token
   @url /index/user/user_login
   */
    public function login_out() {
        $entity = input("param.");
        $this->setResult(false);
        try {
            $this->result['data'] = Token::delUserTonken(['key_name' => $entity['_']]);
            if ($this->result['data']['code'] == 200) {
                $this->setResult($this->result['data']['code']);
            }
            /*$result['message'] = '退出成功！';
            $result['code'] = '200';
            $result['data'] = [];*/
        } catch (\Exception $e) {
            $result['message'] = $e->getMessage();
            $result['code'] = 500;
        }

        $this->json_msg($this->result);
    }
    
    /**
     * 忘记密码-重置密码，
     */
    public function reset_pass(ModelUser $user) {
        $entity = input("param.");
        //$entity['phone'] = md5('11800118000');  //918070513c5a08ba0205d16d78f5220d
       // echo sha1($entity['phone']); //aa7033ac98bc946997a66f48cce255b15e37b77b
        //echo sha1($entity['phone']); 
        //echo md5('aa123456'); //8a6f2805b4515ac12058e79e66539be9
        
        //exit;
        try {

            if (empty($entity['phone'])) { //md5
                throw new \Exception('no get phone');
            }
            if (empty($entity['phone_code'])) {
                throw new \Exception('no get phone_code');
            }
            if (empty($entity['new_password'])) {
                throw new \Exception('no get new_password');
            }

            $phone_code = $entity['phone_code'];
            $pass_action = $entity['new_password']; //md5过来
            $phone = $entity['phone'];
            $login_param = [];
            $login_param['where']['phone'] = sha1($phone);//数据库中的加密手机号码
            $login_param['where']['verify_code_type'] = 2; //2 忘记密码-重置密码
            $get_code = Db::name('verify_code')->where( $login_param['where'] )->order('final_time','desc')->find();
            
            if (empty($get_code)) { //没有验证码
                $result['message'] = lang('message400');
                $result['code'] = 400;
                $this->json_msg($result);
            } else {
                if($get_code['error_num'] >  10){
                    $result['message'] = '验证错误过多，请重新获取!';
                    $result['code'] = 202;
                    $this->json_msg($result);
                }else if ($get_code['phone_code'] != $phone_code) { //前端验证码与数据库的验证码不一致
                    $new_error_num = intval($get_code['error_num']) + 1;
                    Db::name('verify_code')->where( 'id',$get_code['id'] )->update(['error_num'=>$new_error_num ]); //验证码输入错误次数加 1 
                    $result['message'] = '验证码不一致!';
                    $result['code'] = 202;
                    $this->json_msg($result);
                } elseif ($get_code['final_time'] < time()) { //验证码时间过期
                    $result['message'] = '时间过期!';
                    $result['code'] = 202;
                    $this->json_msg($result);
                }
            }

            $_param = [];
            $_param['where']['phone'] = sha1($phone);//数据库中的加密手机号码
            $_param['field'] = ['id,is_use'];
            $getUser = $user->getArr($_param);//通过md5后的手机号码去获取用户信息

            if ($getUser['code'] == 200) {
                if ($getUser['info']['is_use'] != 1 ) { //该号码被管理员虚拟删除
                    $result['code'] = 202; 
                    $result['message'] = '账号异常！'; 
                    $this->json_msg($result);
                }

                $password_key = mt_rand(1000,9999); //密码验证码
                $password = sha1($pass_action . md5($password_key)); //最终数据库密码
                $save_param = [];
                $save_param['where']['id'] = $getUser['info']['id'];
                $save_param['field']['password_key'] = $password_key;
                $save_param['field']['password'] = $password;
                $saveUser = $user->up( $save_param);

                if ($saveUser['code'] != 200) { //
                    $result['code'] = 202; 
                    $result['message'] = '密码重置异常！'; 
                    $this->json_msg($result);
                }             

                $result = array(
                    'data'=>[],
                    'message'=>'密码重置成功！',
                    'code'=>200
                );
                $this->json_msg($result);    
            } else {
                $result['message'] = '该手机账号不存在!';
                $result['code'] = 202;
                $this->json_msg($result);
            }
            
            
        } catch (\Exception $e) {
            $result['message'] = $e->getMessage();
            $result['code'] = '402';
        }

        $this->json_msg($result);
    }

    /*判断手机号码是否存在*/
    public function has_phone(ModelUser $user) {
        $entity = input("param.");
        try {
            if (empty($entity['phone'])) {
                throw new \Exception('no get phone');
            }
            /* echo md5('13800138000'); 7945bd83237335e5376ff44d62e4f0ae
            exit; */
            $phone=sha1($entity['phone']); //前端以MD5传递过来，例如：MD5（13800138000）
            $param = [];
            $param['where']['phone'] = $phone;
            $getUser = $user->getArr($param);

            if ($getUser['code'] == 200) { //已经有该手机号码
                $result['message'] = "该号码已被注册！";
                $result['code'] = 202;
                
            } else {
                $result['message'] = "该号码可以注册！";
            }
            
        } catch (\Exception $e) {
            $result['message'] = $e->getMessage();
            $result['code'] = '402';
        }
        $this->json_msg($result);
    }

    /**
	 * @title 发送验证码
	 * @url /index/user/captche_code
	 * @param string phone 手机号 空 必须
	 * @method POST
	 * @code 1 成功
	 * @code 0 失败
	 * @return int code 状态码
	 * @return obj data 包含验证码的对象
	 */
	public function captche_code() {

         
        //$phone = input('param.phone','13725481157');
        $phone = input('param.phone');
        //$phone = encrypt_qianduan('13725481157');
        $phone = decrypt($phone); //解密base64 
       
        $verify_code_type = input('param.verify_code_type'); //验证类型，1是手机登录，2是忘记密码，3是重置手机号码
         
        $array = [];
		if ($phone) {
            $find_user_phone = Db::name('user')->where('decrypt_phone',$phone)->find();
            if(empty($find_user_phone )){
                $result = ['code'=>204,'message'=>'没有该注册号码'];       
                $this->json_msg($result);
                exit;
            }
			$str='1234567890';  
			//$str='abcdefghijklmnopqrstuvwxyz1234567890';  
			$randStr = str_shuffle($str);  
            $strcode= substr($randStr,0,6);
            $get_send_code_error = 'error ';
            try{
                $array = $this->send_code($phone ,[$strcode, '5'],256159);
            }catch(\Exception $e){
                $get_send_code_error = $e->getMessage();
            }
            
            
            if ($array) { //调用成功
               
                if ($array['statusCode'] == '000000') { //发送成功
                    /* array(2) {
                        ["statusCode"] => string(6) "000000"
                        ["TemplateSMS"] => array(2) {
                          ["smsMessageSid"] => string(32) "8db088fbe2b04a62b85dfae4097b10db"
                          ["dateCreated"] => string(14) "20181120192641"
                        }
                    } */
                      $remark_message = "";

                      if ($verify_code_type == 1) { //手机登录
                        $remark_message = "手机登录";
                      } elseif ($verify_code_type == 2) { //忘记密码
                        $remark_message = "忘记密码";
                      } elseif ($verify_code_type == 3) { //重置手机号码
                        $remark_message = "更换手机号码";
                      } else { //暂时没用
                          return ['code' => 200,'data' => $array];
                      } 
                    $now_time = time();
                    $sha1_md5_phone = sha1(md5($phone));
                    $save_data = [
                        'create_time' => $now_time,
                        'final_time' => $now_time + 180, //有效期 3分钟
                        'decrypt_phone' => $phone,
                        'phone' => $sha1_md5_phone,
                        'verify_code_type' => $verify_code_type,
                        'remark' => $remark_message,
                        'phone_code' => $strcode, //验证码
                    ];
                    $res = Db::name('verify_code')->insert($save_data);
                    if ($res) {
                        $result = ['code'=>200,'message'=>'发送成功！'];
                    }
                    
                } else {
                    /*  array(2) {
                                        ["statusCode"] => string(6) "160034"
                                        ["statusMsg"] => string(15) "号码黑名单"
                                    } */
                    $result = ['code'=>201,'message'=>$array['statusMsg'] ];               
                } 
            } else {
                $result = ['code'=>202,'message'=> $get_send_code_error];
            }
		} else {
			$result = ['code'=>203,'message'=>'请输入手机号码'];
        }

        $this->json_msg($result);
    }

    
    //对象=转数组
    function objectToArray($e) {  
        $e = (array)$e;
        foreach ($e as $k => $v) {
            if (gettype($v) == 'resource') return;
            if (gettype($v) == 'object' || gettype($v) == 'array')
                $e[$k]=(array)$this->objectToArray($v);
        }
        return $e;
    }

	/**
	* 发送模板短信
	* @param to 手机号码集合,用英文逗号分开
	* @param datas 内容数据 格式为数组 例如：array('Marry','Alon')，如不需替换请填 null
	* @param $tempId 模板Id,测试应用和未上线应用使用测试模板请填写1，正式应用上线后填写已申请审核通过的模板ID
	*/    
	public function send_code($to, $datas, $tempId) {
		//https://www.yuntongxun.com
		//主帐号,对应开官网发者主账号下的 ACCOUNT SID
		$accountSid= '8aaf070863c9d21e0163f6e4c28a1a62';
		//主帐号令牌,对应官网开发者主账号下的 AUTH TOKEN
		$accountToken= '913ecbeeb15e4cd9bdef7e8b762c7927';
		//应用Id，在官网应用列表中点击应用，对应应用详情中的APP ID
		//在开发调试的时候，可以使用官网自动为您分配的测试Demo的APP ID
		$appId='8aaf070863c9d21e0163f6e4c2e21a68';
		//请求地址
		//沙盒环境（用于应用开发调试）：sandboxapp.cloopen.com
		//生产环境（用户应用上线使用）：app.cloopen.com
		$serverIP='sandboxapp.cloopen.com';
		//请求端口，生产环境和沙盒环境一致
		$serverPort='8883';
		//REST版本号，在官网文档REST介绍中获得。
		$softVersion='2013-12-26';   
		// 初始化REST SDK
		$rest = new \REST($serverIP, $serverPort, $softVersion);
		$rest->setAccount($accountSid, $accountToken);
		$rest->setAppId($appId);
        $result = $rest->sendTemplateSMS($to, $datas, $tempId);
        $re_result=$this->objectToArray($result);
		return $re_result;
    }
    
    public function aaa(Db $db, ModelUser $b) {
        $aa = $db::name('user')->find();
        dump($aa);
    }

}