<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2018/11/6
 * Time: 14:07
 */

namespace app\common;

use app\index2\model\User;
use app\index2\model\UserToken;
use think\cache\driver\File;
//use think\cache\driver\Redis;
use think\Exception;

class Token
{
    private $memcache;

    public $tokenData = [
        'user_id',
        'token',
        'login_num',
        'begin_time',
        'end_time',
        'sort_time_count',
        'login_lock'
    ];

    /**
     * @param array
     * 获取用户token
     * return array
     **/
    public static function getUserTonken($param)
    {
        $data = [];
        if (empty($param['key_name'])) {
            return ['code' => 401, 'message' => lang('message401'), 'info' => $data];
        }
        try {
            $cache = new File();
         	//$cache = new Redis();
            $user_info = json_decode($cache->get($param['key_name']), true);
            $data = [
                'code' => 200,
                //'info' => json_decode($cache->get($param['key_name']), true),
                'info' => $user_info,
                'message' => lang('message200')
            ];
            
            if(empty($user_info)){
                $data = ['code' => 404, 'message' => '_ is empty', 'info' => $user_info];
            }
            
        } catch (Exception $e) {
            $data = ['code' => 500, 'message' => $e->getMessage(), 'info' => $data];
        }
        return $data;
    }

    /***
     * 对用户信息操作数据组
     * return array
     **/
    public static function getUserGreps($param ,$default = false)
    {   if($default){
         $result = self::getUserGrepsTwo($param);
         return ( $result );
        }
        $data = [];
        if (empty($param['key_name'])) {
            return ['code' => 401, 'message' => lang('message401'), 'info' => $data];
        }
        try {
            
            $data = self::getUserTonken($param);
           
            
            if ($data['code'] != 200) {
                $array = [
                    'code' => 404,
                    'message' => lang('message404')
                ];
                $data = ['code' => 404, 'message' => lang('message404'), 'info' => $array];
                echo json_encode($data);
                
                exit;
            }

            if ($data['info']['is_use'] != 1) {
                $array = [
                    'code' => 403,
                    'message' => lang('message403')
                ];
                $data = ['code' => 403, 'message' => lang('message403'), 'info' => $array];
                echo json_encode($data);
                exit;
            }
            return [
                'code' => 200,
                'user_id' => $data['info']['id'],
                'user_type' => $data['info']['user_type'],
                'company_id' => $data['info']['company_id']
            ];

        } catch (Exception $e) {
            return  ['code' => 500, 'message' => $e->getMessage(), 'data' => $data];
            //$data2 = ['code' => 500, 'message' => $e->getMessage(), 'data' => $data];
           // echo json_encode($data2);
           // exit;
        }

    }

    public  function getUserGrepsTwo($param )
    {
        if (empty($param['key_name'])) {
            return ['code' => 401, 'message' => lang('message401'), 'data' => array()];
        }
        try {
             
            $data = self::getUserTonken($param);
            if ($data['code'] != 200) {
                $data = ['code' => 404, 'message' => lang('message404'), 'data' => array()];
                
               
            } elseif($data['info']['is_use'] != 1) {
                $data = ['code' => 403, 'message' => lang('message403'), 'data' => array()];
                
            }else{
                $array = [
                    'user_id' => $data['info']['id'],
                    'user_type' => $data['info']['user_type'],
                    'company_id' => $data['info']['company_id'],
                ];
                $face = db('user') ->where('id',$array['user_id'])->value('head_photo_url');
                $array['face'] = $face;
                 $data= [
                    'code' => 200,
                    'message' => '获取成功',
                    'data' => $array ,
                    
                ]; 
            }
               return $data;
               

        } catch (Exception $e) {
          
            return  ['code' => 500, 'message' => $e->getMessage(), 'data' => array()];
        }

    }

    /***
     * @param array
     * @example int
     * return array
     * 用户信息获取并且写入到cachel
     **/
    public static function setUserTonken($param, $extime = 10800)
    {
        $data = [];
        if (empty($param['where'])) {
            return ['code' => 401, 'message' => lang('message401'), 'info' => $data];
        }
        if (empty($param['field'])) {
            $param['field'] = ['user_id', 'token'];
        }
        try {
            $token = new UserToken();
            $data = $token->getArr($param);

            if ($data['code'] == 200) {
                $keyName = $data['info']['token'];
                // 写入cache中
              
                $cache = new File();
         	    //$cache = new Redis();
              
                $userModel = new User();
                $param = [];
                $param['where']['id'] = $data['info']['user_id'];
                $data = $userModel->getArr($param);
                $status = $cache->set($keyName, json_encode($data['info']), $extime);
                if ($status == true) {
                    return ['code' => 200, 'message' => lang('message200'), 'info' => $data];
                }
            }
        } catch (Exception $e) {
            $data = ['code' => 500, 'message' => $e->getMessage(), 'info' => $data];
        }
        return $data;
    }

    /**
     * 删除键值对
     * @param array
     * return array
     */
    public static function delUserTonken($param)
    {
        $data = [];
        if (empty($param['key_name'])) {
            return ['code' => 401, 'message' => lang('message401'), 'info' => $data];
        }
        try {
             $cache = new File();
         	 //$cache = new Redis();
          
            $data = [
                'code' => 200,
                'info' => $cache->rm($param['key_name']),
                'message' => lang('message200')
            ];
        } catch (Exception $e) {
            $data = ['code' => 500, 'message' => $e->getMessage(), 'info' => $data];
        }
        return $data;
    }


}

?>