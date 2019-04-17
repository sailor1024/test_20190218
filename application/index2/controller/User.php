<?php
namespace app\index2\controller;

use app\common\Token;
use app\index2\model\User as ModelUser;
use app\index2\model\Company;
use think\Db;
use think\Exception;

class User extends Base {
    public function __construct() {

    }

    /**正在使用用户 */
    public function reception(ModelUser $user) {
        $entity = input('param.');
        $this->setResult(false);
        try {
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            //$userData = ['company_id' => 1, 'user_id' => 1, 'user_type' => 1];
            $entity['company_id'] = $userData['company_id'];
            $entity['user_id'] = $userData['user_id'];
            $entity['user_type'] = $userData['user_type'];
            //不管是管理员还是合作者看的正在使用的用户都是一样的
            // $entity['company_id'] = 1;
            $param['where']['company_id'] = $entity['company_id'];
            $param['where']['is_use'] = 1;//正常可用用户
            $param['field'] = ['id,user_type,decrypt_email,lastname,firstname,head_photo_url'];
            $order_type = !empty($entity['type']) ? $entity['type'] : 1;

            if ($order_type == 1) { //名称
                $param['order'] = ['lastname'=>'asc'];
            } else {  //时间
                $param['order'] = ['create_time'=>'desc'];
            }

            $getUserList = $user->getList($param);

            if ($getUserList['info'] == []) {
                $this->result['message'] = 'no_user';
            }

            $this->result['code'] = 200;
            $this->result['data'] = $getUserList['info'];
        } catch (\Exception $e) {
            $this->result['message'] = $e->getMessage();
        }
        $this->json_msg($this->result);
    }

    /**正在邀请的用户 */
    public function wait_reception() {
        $entity = input('param.');
        $this->setResult(false);

        try {
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            //$userData = ['company_id' => 1, 'user_id' => 1, 'user_type' => 1];
            $entity['company_id'] =$userData['company_id'];
            $entity['user_id'] =$userData['user_id'];
            $entity['user_type'] =$userData['user_type'];

            if ($userData['user_type'] == 3) {
                $result['message'] = '权限不够';
                $result['code'] = '202';
                $result['data'] = [];
                $this->json_msg($result);
            }

            $param['where']['company_id'] = $entity['company_id'];
            // $param['where']['company_id'] = 1;
            $param['field'] = ['id,user_type,invite_email as decrypt_email'];
            $order_type = !empty($entity['type']) ? $entity['type'] : 1;

            if ($order_type == 1) { //名称
                $param['order'] = ['user_id'=>'asc'];
            } else {  //时间
                $param['order'] = ['create_time'=>'desc'];
            }

            $getWaitUserList = Db::name('email_invite')->where($param['where'])->field($param['field'])->order($param['order'])->select();
            $this->result['message'] = 'success!';
            $this->result['code'] = 200;
            $this->result['data'] = $getWaitUserList;
        } catch (\Exception $e) {
            $this->result['message'] = $e->getMessage();
        }
        $this->json_msg($this->result);
    }

    /**被删除的用户 */
    public function delete_reception(ModelUser $user) {
        $entity = input('param.');
        $this->setResult(false);
        try {
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            //$userData = ['company_id' => 1, 'user_id' => 1, 'user_type' => 1];
            $entity['company_id'] =$userData['company_id'];
            $entity['user_id'] =$userData['user_id'];
            $entity['user_type'] =$userData['user_type'];
            if ($userData['user_type'] == 3) {//合作者没有查看该功能
                $result['message'] = '权限不够';
                $result['code'] = '202';
                $result['data'] = [];
                $this->json_msg($result);
            }
            // $entity['company_id'] = 1;
            $param['where']['company_id'] = $entity['company_id'];
            $param['where']['is_use'] = 0;//被删除用户
            $param['field'] = ['id,user_type,decrypt_email,lastname,firstname,head_photo_url'];
            $order_type = !empty($entity['type']) ? $entity['type'] : 1;

            if ($order_type == 1) { //名称
                $param['order'] = ['lastname'=>'asc'];
            } else {  //时间
                $param['order'] = ['create_time'=>'desc'];
            }

            $getUserList = $user->getList($param);

            if ($getUserList['info'] == []) {
                $this->result['message'] = 'no_deleteUser!';
            }

            $this->result['message'] = 'success!';
            $this->result['code'] = 200;
            $this->result['data'] = $getUserList['info'];
        } catch (\Exception $e) {
            $this->result['message'] = $e->getMessage();
        }
        $this->json_msg($this->result);
    }

    /***
     * 协作者详情
     */
    public function un_userdetil(ModelUser $user) {
        $entity = input('param.');
        $userData = Token::getUserGreps(['key_name' => $entity['_']]);
        $entity['company_id'] = $userData['company_id'];
        $this->setResult(false);
        try {
            /* if($entity['user_type'] != 3 || $entity['user_type'] !=33){
                $this->json_msg($this->result);
            } */
            // $param['where']['id'] = 1;
            $param['where']['id'] = $entity['id'];
            $param['where']['company_id'] = $entity['company_id'];
            $param['field'] = ['id,user_type,lastname,firstname,decrypt_email,decrypt_phone,create_time,head_photo_url'];
            //$getUserdetail['info'] = Db::name('user')->field($param['field'])->find($param['where']['id']);
            $getUserdetail = $user->getArr($param);//获取一条用户信息

            if ($getUserdetail['info'] == []) {
                $this->json_msg($this->result);
            }

            $this->result['message'] = 'success!';
            $this->result['code'] = 200;
            $this->result['data'] = $getUserdetail['info'];
        } catch (\Exception $e) {
            $this->result['message'] = $e->getMessage();
        }
        $this->json_msg($this->result);
    }

    /**
     * 恢复用户
     */
    public function recover_user(ModelUser $user) {
        $entity = input('param.');
        $this->setResult(false);
        $param = [];

        try {
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            //$userData = ['company_id' => 1, 'user_id' => 1, 'user_type' => 1];
            $entity['company_id'] =$userData['company_id'];
            $entity['user_id'] =$userData['user_id'];
            $entity['user_type'] =$userData['user_type'];

            if ($userData['user_type'] == 3) {
                $result['message'] = '权限不够';
                $result['code'] = '202';
                $result['data'] = [];
                $this->json_msg($result);
            }
            
            $param['where']['id'] = $entity['id'];
            $param['where']['company_id'] = $entity['company_id'];
            $param['field']['is_use'] = 1;
            $getUserStatus = $user->up($param);
            $this->result['message'] = 'recove success!';

            if ($getUserStatus['code'] != 200) {
                $this->result['message'] = 'faild!';
                $this->result['code'] = 202;
                $this->json_msg($this->result);
            }

            $this->result['data'] = [];
            $this->result['code'] = 200;
        } catch (\Exception $e) {
            $this->result['message'] = $e->getMessage();
        }
        $this->json_msg($this->result);
    }

    /**
     *管理员删除用户
     */
    public function remove_user(ModelUser $user) {
        $entity = input('param.');
        $this->setResult(202);
        $param = [];

        try {
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            //$userData = ['company_id' => 1, 'user_id' => 1, "user_type" => 3];
            /* $param['company_id'] = $userData['company_id'];
            $param['user_id'] = $userData['user_id'];
            $param['user_type'] = $userData['user_type']; */

            if ($userData['user_type'] == 3) { //合作者没有该功能
                $this->result['data'] = [];
                $this->result['code'] = 202;
                $this->result['message'] = '权限不够';
                $this->json_msg($this->result);
            }

            $param['where']['id'] = $entity['id'];
            $param['where']['company_id'] = $userData['company_id'];
            $param['field']['is_use'] = 0;
            $getUserStatus = $user->up($param);
            $this->result['message'] = 'remove success!';
            
            if ($getUserStatus['code'] != 200) {
                $this->result['message'] = 'faild!';
                $this->result['code'] = 202;
                $this->json_msg($this->result);
            }

            $this->result['data'] = [];
            $this->result['code'] = 200;
        } catch (\Exception $e) {
            $this->result['message'] = $e->getMessage();
        }
        $this->json_msg($this->result);
    }

    /**
     * 更新用户信息,
     * 管理员和自己可以操作
     */
    public function update_user(ModelUser $user) {
        $entity = input('param.');
        $this->setResult(false);
        $param = [];

        try {
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            //$userData = ['company_id' => 1, 'user_id' => 1, "user_type" => 1];
            /* $param['company_id'] = $userData['company_id'];
            $param['user_id'] = $userData['user_id'];
            $param['user_type'] = $userData['user_type']; */

            if ($userData['user_type'] == 3 && $userData['user_id'] != $entity['id']) { //不是修改自己,且自己是个合作者，没有该权限
                $this->result['data'] = [];
                $this->result['code'] = 202;
                $this->result['message'] = '权限不够';
                $this->json_msg($this->result);
            }

            $param['where']['id'] = $entity['id'];
            $param['where']['company_id'] = $userData['company_id'];
            
            if (!empty($entity['lastname'])) {
                $param['field']['lastname'] = $entity['lastname'];//更新姓
            }
            
            if (!empty($entity['firstname'])) {
                $param['field']['firstname'] = $entity['firstname'];//更新姓
            }
            
            if (!empty($entity['user_type'])) {
                $param['field']['user_type'] = $entity['user_type']; //更新用户的权限
            }

            $getUserStatus = $user->up($param);
            $this->result['message'] = 'update-user success!';
            
            if ($getUserStatus['code'] != 200) {
                $this->result['message'] = 'faild!';
                $this->result['code'] = 202;
                $this->json_msg($this->result);
            }
            $this->result['data'] = [];
            $this->result['code'] = 200;
        } catch (\Exception $e) {
            $this->result['message'] = $e->getMessage();
        }
        $this->json_msg($this->result);
    }

    //用户接受邀请并激活帐号
    /*public function activating_email(Token $token, ModelUser $user)
    {
        $tk = input('param._');//用户tk
        //$phone = input('param.phone');
        $this->setResult(401);
        try {
            $userData = Token::getUserGreps(['key_name' => $tk]);

        } catch (Exception $exception) {
            $this->result['message'] = $exception->getMessage();
        }
        $this->json_msg($this->result);
    }*/

    /***
     *编辑用户个人信息
     * $entity['_'] = '2bfef4b8b922359099769a77bf7f77ed';
     * $entity['firstname'] = '小';
     * $entity['lastname'] = '林林';
     * $entity['password'] = 'd656f8fe7d91dcb86f52019203a31fe6';
     * $entity['regpassword'] = 'd656f8fe7d91dcb86f52019203a31fe6';
     * $entity['origpassword'] = 'ad48ae0f8139e311b682e35e30140c83';
     ***/
    public function edit_user(ModelUser $user) {
        $entity = input('param.');
        $this->setResult(false);

        try {
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            $entity['id'] = $userData['user_id'];
            $this->result['data'] = $user->editUser($entity);

            if (!empty($this->result['data']['code'])) {
                $this->setResult($this->result['data']['code']);
            }

        } catch (Exception $exception) {
            $this->result['message'] = $exception->getMessage();
            $error_message = $this->result['message'];
            $error_return_msg = [
                ['phone_unique','该手机号码已存在！'],
                ['email_unique','该邮件已存在！'],
            ];
            if ( strpos($error_message,$error_return_msg[0][0])) {  //手机号已经存在
                $this->result['message'] = $error_return_msg[0][1];
            } else if (strpos($error_message,$error_return_msg[1][0])) { //邮件已经存在
                $this->result['message'] = $error_return_msg[1][1];
            }
        }
        $this->json_msg($this->result);
    }

    /*组织信息*/
    public function organization() {
        $user = new ModelUser();
        $company = new Company();
        $entity = input('param.');
        $this->setResult(false);

        try {
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            /* $userData['user_id'] = 1;
            $userData['company_id'] = 1;
            $userData['user_type'] = 1; */
            $entity['user_id'] = $userData['user_id'];
            $entity['company_id'] = $userData['company_id'];
            $entity['user_type'] = $userData['user_type'];

            if ($entity['user_type']  == 3) {
                $this->setResult(400);
                $this->json_msg($this->result);
            }

            $_user_param['where']['company_id'] = $entity['company_id']; //公司id
            $_user_param['where']['id'] = $entity['user_id']; //用户id
            $_user_param['field'] = ['id,user_type,company_id']; 
            $getUserMessage = $user->getArr($_user_param);
            if ($getUserMessage['code'] != 200) {
                $this->result['code'] = 401;
                $this->json_msg($this->result);
            } else {
                $_param_company['where']['id'] = $userData['company_id'];
                $_param_company['field'] = ['company_name'];
                $getCompanyMessage  = $company->getArr($_param_company);
                if ($getCompanyMessage['code'] != 200) {
                    $this->result['code'] = 401;
                    $this->json_msg($this->result);
                } 
                $getUserMessage['info']['company_name'] = $getCompanyMessage['info']['company_name'];
            }

            $this->result = [
                'code' => 200,
                'message' => 'is success!',
                'data' => $getUserMessage['info'],
            ];
        } catch (Exception $exception) {
            $this->result['message'] = $exception->getMessage();
        }
        $this->json_msg($this->result);
    }

     /*编辑组织信息*/
    public function edit_organization(ModelUser $user,Company $company) {
        $entity = input('param.');
        $this->setResult(false);
        
        try {
            Db::startTrans();// 启动事务
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            /* $userData['user_id'] = 1;
            $userData['company_id'] = 1;
            $userData['user_type'] = 1; */

            if ( $userData['user_type']  == 3) {
                $this->setResult(400);
                $this->json_msg($this->result);
            }

            if (!empty($entity['company_name'])) {
                $editCompanyMessage['code'] = 200; 
                $_param_company['where']['id'] = $userData['company_id'];
                $_param_company['field']['company_name'] = $entity['company_name']; //修改公司名称
                $editCompanyMessage  = $company->up($_param_company);

                if ($editCompanyMessage['code'] != 200) {
                    throw new \Exception('组织名称修改失败！') ;
                } 
            }
            
            if (!empty($entity['edit_user_type'])) { 
                $editUserMessage['code'] = 200;
                if ($entity['edit_user_type'] != $userData['user_type']) { //证明需要修改
                    $_user_param['where']['company_id'] = $userData['company_id']; //公司id
                    $_user_param['where']['id'] = $userData['user_id']; //用户id
                    $_user_param['where']['is_use'] =  1 ; //正在使用的用户
                    $_user_param['field']['user_type'] =  $entity['edit_user_type']; 
                    $editUserMessage = $user->up($_user_param);
                } else {

                }

                if ($editUserMessage['code'] != 200) {
                    throw new \Exception('用户类型修改失败！') ;
                }
            }

            $this->result = [
                'code' => 200,
                'message' => 'edit is success!',
                'data' => [],
            ];
            Db::commit(); // 提交事务      
        } catch (\Exception $exception) {
            Db::rollback();// 回滚事务
            $this->result['message'] = $exception->getMessage();
            $this->result['code'] = 401;
        }
        $this->json_msg($this->result);
    }

    /**正在使用并且是管理员的用户 */
    public function manage_user(ModelUser $user) {
        $entity = input('param.');
        $this->setResult(false);
        try {
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            /* $userData['user_id'] = 1;
            $userData['company_id'] = 1;
            $userData['user_type'] = 1; */ 
            $entity['user_id'] = $userData['user_id'];
            $entity['company_id'] = $userData['company_id'];
            $entity['user_type'] = $userData['user_type'];

            if ($userData['user_type']  == 3) {
                $this->setResult(400);
                $this->json_msg($this->result);
            }

            $_user_param['where']['company_id'] = $entity['company_id']; //公司id
            $_user_param['where']['is_use'] = 1;
            $_user_param['where']['user_type'] = ['<>',3];
            $_user_param['field'] = ['id,user_type,firstname,lastname,decrypt_email,head_photo_url']; 
            $getUserList = $user->getList($_user_param);

            if ($getUserList['code'] != 200) {
                $this->result['code'] = 401;
                $this->json_msg($this->result);
            }

            $this->result['code'] = 200;
            $this->result['message'] = '获取成功';
            $this->result['data'] = $getUserList['info'];
        } catch (\Exception $e) {
            $this->result['message'] = $e->getMessage();
        }
        $this->json_msg($this->result);
    }

    //修改手机号码
    public function edit_phone(ModelUser $user) {
        $entity = input('param.');
        $result = array(
            'code' => 201,
            'message' =>'',
            'data' =>[]
        );
        
        try {
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
           /* $userData['user_id'] = 70;
           $entity['decrypt_phone'] = encrypt_qianduan('14715906787');
           $entity['phone_code'] = '123456'; */
            $phone_code = $entity['phone_code'];//验证码
            $decrypt_phone_base = $entity['decrypt_phone'];//新手机号码 base64
            $decrypt_phone = decrypt($decrypt_phone_base); //解密base64 
            $login_param = [];
            $login_param['where']['decrypt_phone'] = $decrypt_phone;
            $login_param['where']['verify_code_type'] = 3; //3 重置手机号码
            $get_code = Db::name('verify_code')->where( $login_param['where'] )->order('final_time','desc')->find();
            
            if (empty($get_code)) { //没有验证码
                $result['message'] = lang('message400');
                $result['code'] = 400;
                $this->json_msg($result);
            } else {
                if ( $get_code['phone_code'] != $phone_code) { //前端验证码与数据库的验证码不一致
                    $result['message'] = '验证码不一致!';
                    $result['code'] = 202;
                    $this->json_msg($result);
                } elseif ($get_code['final_time'] < time()) { //验证码时间过期
                    $result['message'] = '时间过期!';
                    $result['code'] = 202;
                    $this->json_msg($result);
                }
            }
            //更新手机号码
            $param_up_phone = [];
            $param_up_phone ['where']['id'] = $userData['user_id'];
            $param_up_phone ['field']['phone'] =  sha1(md5($decrypt_phone));//数据库中的加密手机号码 ，
            $param_up_phone ['field']['decrypt_phone'] =   $decrypt_phone;//普通手机号码 例如13800138000
            $save_phone_message = $user->up($param_up_phone);
            if ($save_phone_message['code'] == 200) {
                $result['message'] = '手机号码更新成功!';
                $result['code'] =  200;
                $this->json_msg($result);
            } else {
                $result['message'] = '更新异常!';
                $result['code'] = 202;
                $this->json_msg($result);
            }
        } catch (Exception $exception) {
            $result['code'] = 401;
            $result['message'] = $exception->getMessage();
  
        }
        $this->json_msg($result);
    }

    //编辑头像,上传
    public function head_photo(ModelUser $user) {
        $entity = input('param.');
        $result = array(
            'code' => 201,
            'message' =>'',
            'data' =>[
                'head_photo_url' =>''
            ]
        );
        
        try {
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            $photo_file = $_FILES['head_photo'] ;
            
            if (!$photo_file) { //没有
                throw new \Exception('no image steam');
            }

            

            if (is_dir('./uploads/images')) {
                       
            } else {
                 mkdir('./uploads/images');
            }

            if (is_dir('./uploads/images/head')) {
                       
            } else {
                 mkdir('./uploads/images/head');
            }

            if (is_dir('./uploads/images/head/u'.$userData['user_id'])) {
                       
            } else {
                 mkdir('./uploads/images/head/u'.$userData['user_id']);
            }
            //dump($photo_file);
            $name = explode('.',$photo_file['name']);
            $ext_name = end($name); //文件扩展名
            //$file_name = 'hp'.mt_rand(100,999).uniqid().date('ymd').mt_rand(1000,9999).'.'.$name[1];

            $file_name = 'head_photo.'.  $ext_name  ;
            $file_link_name = 'uploads/images/head/u'.$userData['user_id'].'/' .$file_name;
            if(file_exists($file_link_name)){
                unlink($file_link_name);
            }
            
            $t = move_uploaded_file($photo_file['tmp_name'],      $file_link_name );
            if ($t) {
               // HTTP_HOST //["HTTP_HOST"] => string(17) "todo.kangyun3d.cn"
                $http_link = $_SERVER['REQUEST_SCHEME'] .'://'.$_SERVER['HTTP_HOST'];//https://www.xxx.com
                $_edit_param = [];
                $_edit_param['where']['id'] = $userData ['user_id'];
                $images_all_link = $http_link . '/' . $file_link_name; 
                $_edit_param['field']['head_photo_url'] =$images_all_link;
                $_edit_param['field']['update_time'] = time(); //因为 $images_all_link 可能已经存在数据库中，导致没有变化，而修改失败
                $get_message = $user->up($_edit_param);
                if ($get_message['code'] == 200) {
                    $result = array(
                        'code' => 200,
                        'message' =>'保存成功!',
                        'data' => [
                            'head_photo_url' => $images_all_link , 
                        ]
                    );
                } else {
                    throw new \Exception('数据保存异常！'); 
                }

            } else {
                throw new \Exception('文件保存异常！'); 
            }          

        } catch (\Exception $e) {
           $result['message'] = $e->getMessage() ;
        }   
        $this->json_msg($result); 
    }

}