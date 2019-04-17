<?php

namespace app\index2\model;

use think\Db;
use think\Exception;
use think\Model;
use app\index2\model\User;

class Login extends Model
{

    /* 
    用户注册
    * @param int  register_user_type 用户所属类型，默认是3，1是超级管理员，2是普通管理员，3是普通合作者

    */
    public function user_register($entity)
    {

        if (empty($entity['decrypt_phone'])) {   
            throw new \Exception('没有手机号码！');
        }
        $decrypt_phone = decrypt($entity['decrypt_phone']); //解密后的手机号码，如13800138000
        $save_data['decrypt_phone'] = $decrypt_phone; 
        $save_data['phone'] = sha1(md5($decrypt_phone)); //手机加密不可逆

        if (empty($entity['decrypt_email'])) {
            throw new \Exception('没有邮箱！');
        }
        $decrypt_email = $entity['decrypt_email'];  // 如13800138000@163.com
        $save_data['decrypt_email'] = $decrypt_email;

        $save_data['email'] = sha1(md5($decrypt_email));//邮箱机密不可逆


        $pass_action = $entity['password']; //由前端传过来的MD5加密密码
        $pass_key = mt_rand(1000, 9999);

        $password = sha1($pass_action . md5($pass_key)); //最终数据库密码

        $save_data['uuid'] = 'uuid'. mt_rand(123456,65432188) . uniqid() . mt_rand(123456,654321);
        $save_data['company_id'] = $entity['company_id']; //公司id
        $save_data['father_id'] = !empty($entity['father_id']) ? $entity['father_id'] : 0 ; //father_id=0是第一个注册用户
        $save_data['user_type'] = !empty($entity['register_user_type']) ? $entity['register_user_type'] : 3; //user_type //管理员或合作者

        $save_data['lastname'] = !empty($entity['lastname']) ? $entity['lastname'] : ''; //姓
        $save_data['firstname'] = !empty($entity['firstname']) ? $entity['firstname'] : ''; //名

        $save_data['password'] = $password;
        $save_data['password_key'] = $pass_key;

        $save_data['create_time'] = time();//注册时间


        try {


            $data = Db::name('user')->insertGetId($save_data);


            if ($data > 0) { //用户注册成功！

                //判断那种注册方式，如果是邀请注册，将email_invite表数据删除
                if (!empty($entity['email_invite_id'])) { //证明是邀请方式注册
                    Db::name('email_invite')->where('id', $entity['email_invite_id'])->delete();
                }

                
                $result['code'] = '200';
                $result['message'] = '注册用户成功！';
                $result['data'] = [];


            } else {

                $result['code'] = '201';
                $result['message'] = '注册用户失败！';
                $result['data'] = [];
            }
            // Db::commit(); // 提交事务
        } catch (\Exception $e) {
            // Db::rollback(); // 回滚事务
            $result['code'] = '401';
            $result['message'] = $e->getMessage();
            $result['data'] = [];

            //前端友好提示
            $error_message = $result['message'];
            $error_return_msg = [
                ['phone_unique','该手机号码已存在！'],
                ['email_unique','该邮件已存在！'],
            ];
            //检测插入失败返回的sql错误提示
            if( strpos($error_message,$error_return_msg[0][0]) ){  //手机号已经存在
                $result['message'] = $error_return_msg[0][1];
            }else if(strpos($error_message,$error_return_msg[1][0]) ){ //邮件已经存在
                $result['message'] = $error_return_msg[1][1];
            }

        }

        return $result;


    }

    /* 
    邀请注册
    _register
    */
    public function invite_register($entity)
    {

        /*  $test_data = [
            'email_key' => '5bda605f212ea121490',//邮箱验证码,
            'decrypt_phone' => encrypt_qianduan('13725481157'), //模拟前端加密方式，可解密
            'password' => md5('lu123456'),
            'lastname' => '孙',  //姓
            'firstname' => '英', //名


        ]; */
        // $entity= $test_data;

        if (empty($entity['email_key'])) {
            throw new \Exception('没有邮件验证码！');
        } else {
            $email_key = $entity['email_key'];

        }

        try {
            //接收emial_key就行了，因为是唯一值
            $res = Db::name('email_invite')
                ->where('email_key', $email_key)
                ->find();
            if (!empty($res)) { //证明有该邮箱
                //先转换邮箱字段
                $entity['decrypt_email'] = $res['invite_email'];  //admin@admin.com

                $entity['father_id'] = $res['user_id'];//邀请者id

                $entity['email_invite_id'] = $res['id']; //邀请表id

                $entity['company_id'] = $res['company_id']; //公司id
                $entity['register_user_type'] = $res['user_type'];  //邀请者权限类型

                $entity['register_type'] = 'invite_register'; //注册方式
                $res_data = $this->user_register($entity);

                $result = $res_data;

                /*  $result['code'] = '200';
                 $result['message'] = '邮箱验证成功！';
                 $result['data'] = $res; */
            } else {
                $result['code'] = '202';
                $result['message'] = '没有邀请该邮箱或者已经被注册！';
                $result['data'] = [];
            }

        } catch (\Exception $e) {
            $result['code'] = '401';
            $result['message'] = $e->getMessage();
            $result['data'] = [];

            


        }

        return $result;


    }

    /* 
    注册公司，
    注册公司是会首先注册一个用户，即超级管理员
    * @param string name 公司名称
    * @param string address 公司地址（可选）

    */
    public function company_register($entity)
    {

       /*  $test_data = [
            'company_name' => '广东康云多维视觉有限公司', //必须
            'decrypt_phone' => encrypt_qianduan('12345678910'), //模拟前端加密方式，可解密
            'password' => md5('lu123456'),
            'lastname' => '张',  //姓
            'firstname' => '涛', //名

        ]; */
        //$entity= $test_data;

        $save_data['company_address'] = !empty($entity['company_address']) ? $entity['company_address'] : '';
        $save_data['company_name'] = $entity['company_name'];
        $save_data['create_time'] = time();
        $save_data['status'] = 2; //审核中
        $result = [
            'code'=>201,
            'message'=>'',
            'data'=>[],
        ];
        //Db::startTrans(); // 启动事务
        try {


            $data = Db::name('company')->insertGetId($save_data);
            if ($data > 0) { //公司注册成功！
                // cache('aaaaaaaa',$data);
                $entity['company_id'] = $data; //将注册公司的id作为user的company_id
                $entity['register_user_type'] = 2; //user_type = 2 ,即 管理员
                $entity['father_id'] = 0; //father_id = 0 ,即超级管理员的父级id一定是 0

                $entity['register_type'] = 'company_register'; //注册方式
                $re_data = $this->user_register($entity);
                if($re_data['code'] == 200 ){ //证明注册成功，但是组织需要被审核
                    $re_data['message'] = '注册成功,正在由康云科技审核中！';
                }
                $result = $re_data;

            } else {
                $result['code'] = '202';
                $result['message'] = '公司注册失败！';
                $return['data'] = [];
            }

            // Db::commit(); // 提交事务
        } catch (\Exception $e) {
            //  Db::rollback(); // 回滚事务

            $result['code'] = '401';
            $result['message'] = $e->getMessage();
            $return['data'] = [];
        }
        return $result;
    }

    /**
     * 用户登录
     *  */
    public function user_login($entity)
    {
        // $entity=$test_data;
        /*$entity = [
            'phone_email' => md5('1663852293@qq.com'),//前端过来MD5的手机或邮箱
            'password' => md5('lu123456'),//前端过来MD5的密码

        ];*/

        //先接受手机号码或邮箱,已经 md5的邮箱或手机号
        $phone_email = $entity['phone_email'];//前端过来MD5的手机或邮箱
        $save_pass = $entity['password']; //获取前端MD5密码 

        $phone_email = sha1($phone_email);//可参考注册方法

        try {
            $find_user = Db::table('user')
                ->where('phone', $phone_email)
                ->whereOr('email', $phone_email)
                ->field('id,user_type,company_id,father_id,lastname,firstname,decrypt_email,decrypt_phone,password_key,password,is_use,head_photo_url')
                ->find();

            if (empty($find_user)) { //可能是已经邀请了但是还没有注册，也有可能是没邀请过

                // 去邀请表里找是否已经邀请但未被注册的加密邮箱
                $find_invite_email = Db::table('email_invite')->where('email',$phone_email)->find();
                if(empty($find_invite_email) ){  //该邮箱没有被邀请

                    $result['code'] = '201';
                    $result['message'] = '请输入正确的账号或密码!';//该账号不存在
                    $return['data'] = [];

                }else{ //有邀请未注册
                    $result['code'] = '205';
                    $result['message'] = '该账号尚未激活!';// 
                    $return['data'] = [];
                }


                
            } else {

                




                if($find_user['is_use'] != 1){ //判断是否被内部组织冻结
                    
                    $result['code'] = '204';
                    $result['message'] = '该账号被冻结！';
                    $return['data'] = [];
                    return $result;
                }
       
                $password_key = $find_user['password_key'];
                $password = sha1($save_pass . md5($password_key));
                if ($password == $find_user['password']) {
                    $_param = [];
                    $_param['user_id'] = $find_user['id'];
                    $_param = $this->setToken($_param);
                    if ($_param['code'] != 200) {
                        $result['code'] = '401';
                        $result['message'] = lang('message401');
                        $result['data'] = [];
                        return $result;
                    }
                    

                    //查看公司信息
                    $company_message = Db::name('company')->where('id',$find_user['company_id'])->field('company_name,status')->find();
                    if(!empty($company_message)){
                        //判断公司是否被康云审核通过 2019-03-30添加
                        if($company_message['status'] == 1){ //正常使用
                            $find_user['company_name'] = $company_message['company_name'];
                        }else if($company_message['status'] == 2){ //审核中 
                            return ['code'=> 206 , 'message' => '账号审核中！', 'data'=>[] ];
                        }else {//还没定义
                            return ['code'=> 207 , 'message' => '公司验证异常', 'data'=>[] ];
                        }

                       
                    }else{
                        $find_user['company_name'] = '';
                    }

                    $token = $_param['info'];
                    $result['code'] = '200';
                    $result['message'] = '登录成功！';
                    //添加token放回给前端
                    $find_user['token'] = $token;
                    //返回前将密码和密码验证码除去
                    unset($find_user['password_key']);
                    unset($find_user['password']);
                    unset($find_user['is_use']);
                    
                    $result['data'] = $find_user;
                } else {
                    $result['code'] = '202';
                    $result['message'] = '密码错误！';
                    $result['data'] = [];
                    // $result['data'] = '111';
                }

            }
        } catch (\Exception $e) {
            $result['code'] = '401';
            $result['message'] = $e->getMessage();
            $result['data'] = [];
        }
        /* dump($result);
        exit; */
        return $result;
    }

    /***
     * 设置用户token
     * @param array
     */
    public function setToken($param)
    {
        $data = [];
        if (empty($param['user_id'])) {
            return ['code' => 401, 'message' => lang('message401'), 'info' => $data];
        }
        $this->startTrans();
        try {
            $userMode = new User();
            $userTokenModel = new UserToken();
            $param['where']['id'] = $param['user_id'];
            $userData = $userMode->getArr($param);
            if ($userData['code'] != 200) {
                return ['code' => 402, 'message' => lang('message401'), 'info' => $data];
            }
            $param['where']['user_id'] = $param['user_id'];
            unset($param['where']['id']);
            $userTokenData = $userTokenModel->getArr($param);

            if ($userTokenData['code'] != 200) {// 说明该用户第一次登陆
                $token = $this->user_token($param['user_id']);
                $saveData = $this->save_token($token, $param['user_id']);
                if ($saveData['code'] != 200) {
                    $this->rollback();
                    return ['code' => 403, 'message' => lang('message401'), 'info' => $data];
                }
                $userTokenData = $userTokenModel->getArr($param);
            }
            $token = $userTokenData['info']['token'];
            /**开始处理业务逻辑*/
            if ($userTokenData['info']['sort_time_count'] < 5) {
                $param['field']['sort_time_count'] = $userTokenData['info']['sort_time_count'] + 1;
                $param['field']['end_time'] = time();

            } else {
                $token = $this->user_token($param['user_id']);
                $param['field']['sort_time_count'] = 0;
                $param['field']['end_time'] = time();
                $param['field']['begin_time'] = time();
                $param['field']['token'] = $token;
            }
            $data = $userTokenModel->up($param);
            if ($data['code'] != 200) {
                $this->rollback();
                return ['code' => 404, 'message' => lang('message401'), 'info' => $data];
            }
            $data = ['code' => 200, 'message' => lang('message200'), 'info' => $token];
            $this->commit();
        } catch (Exception $e) {
            $this->rollback();
            $data = ['code' => 405, 'message' => $e->getPrevious()];
        }
        return $data;
    }


    //生成token
    public function user_token($user_id)
    {
        if (empty($user_id)) {
            throw new \Exception('用户id不存在');
            exit;
        }
        $token = 'ky' . $user_id . time() . rand(1000, 9999) . rand(10, 99);
        $token = md5($token);
        return $token;
    }

    //保存token到user_token表
    public function save_token($token, $user_id)
    {
        $save_data = [
            'token' => $token,
            'user_id' => $user_id,
            'begin_time' => time(),
        ];

        try {
            $res = $saveToken = Db::name('user_token')->insert($save_data);

            if ($res > 0) {
                $result['code'] = '200';
                $result['message'] = 'token保存成功！';
                $return['data'] = [];
                // $result=$this->my_message(200,'错误'，[]);
            } else {
                $result['code'] = '400';
                $result['message'] = 'token保存失败！';
                $return['data'] = [];

            }
        } catch (\Exception $e) {
            $result['code'] = '401';
            $result['message'] = $e->getMessage();
            $return['data'] = [];

        }

        return $result;

    }

    //用户是否注册
    public function has_phone($entity){
        $result = [];
        $_param = [];
        $phone  = $entity['phone']; //md5传过来的号码 例如 MD5(13800138000)
        
        $decrypt_phone=decrypt($phone); //解密
       // $_parnm['where']['phone'] = $phone;
        $_parnm['where']['decrypt_phone'] = $decrypt_phone;
        $_parnm['field']=['id'];
        $user = new User();
        $getPhone = $user->getArr($_parnm);
        if ($getPhone['code'] == 200 ){ //该号码被注册
            $result['code'] = 201;
            $result['message'] = '该号码已被注册';
        } else{
            
            $result['message'] = '可以注册';
        }
        return $result;
    }

    


}


?>