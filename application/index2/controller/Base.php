<?php
namespace app\index2\controller;
//header_remove('Access-Control-Allow-Origin');
//header('Access-Control-Allow-Origin:*');
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept ,path ,token ,uploadway,* ");
//header("Access-Control-Allow-Headers: *");
//header('Access-Control-Request-Headers: *');
header('Access-Control-Allow-Methods: GET, POST, PUT,DELETE,OPTIONS');
ini_set("display_errors", "On");
error_reporting(E_ALL);

/*
*基类
*/
use app\common\Token;

class Base {
    public $redis;
    protected $result = [
        'code' => 200,
        'message' => '',
        'data' => []
    ];

    public function __construct() {   
        //获取用户存储在redis的信息
        $this->redis = new Token();
    }

    /**
     *设置成员属性
     */
    public function setResult($type = false, $data = []) {
        
        if (!$type) {
            $this->result['code'] = 401;
            $this->result['data']['code'] = 401;
            $this->result['data']['info'] = lang('message' . $this->result['code']);
        }

        if ($type >= 200) {
            $this->result['code'] = $type;
            $this->result['data']['code'] = $type;

            if (empty($this->result['data']['info'])) {
                $this->result['data']['info'] = lang('message' . $this->result['code']);
            }

        }

        $this->result['message'] = lang('message' . $this->result['code']);

    }

    /**
     *
     */
    /*
    *默认操作
    */
    public function index() {

    }

    /*
    *空操作
    */
    public function _empty() {
        echo "empty()";
    }

    /*
    *   code状态码说明
    *
    *   code = 0    请求失败
    *   code = 1    请求成功
    *   code = 2    用户已存在
    *
    *   函数输出
    */
     public function json_echo($data = array(), $code = 0) {
    	$array = $data;
    	if ($data && $code == 1) {
    	//if ($data && $code == 0) {
    		$code = 1;
    		$array = $data;
    	}

    	$res = array(
    		'code'=>$code,
    		'data'=>$array
    	);
        echo json_encode($res);
    } 

    public function get_uuid() {
        return md5(uniqid() . rand(1000, 9999));
    }

    /*  public function return_msg($code='200',$msg='',$data=''){

         return json_encode(['code'=>$code,'msg'=>$msg,'data'=>$data]);

     } */
    public function json_msg($get_data) {
        $code = !empty($get_data['code'])?$get_data['code']:200;
        $message = !empty($get_data['message'])?$get_data['message']:'';
        $data = !empty($get_data['data'])?$get_data['data']:'';
        header('Content-Type:application/json');
        $return['code'] = intval($code);
        $return['message'] = $message;

        if (!empty($data)) {
            $return['data'] = $data;
        } else {
            $return['data'] = [];
        }

        echo json_encode($return, JSON_UNESCAPED_UNICODE);
        exit;
    }

    /**
     * 设置不必要的数组
     */
    public function set_array_null($array, $_array) {
        if (!is_array($array) || !is_array($_array)) {
            return $array;
        }
        
        return array_merge($array, $_array);
    }

    /**
     * 检测接口请求类型
     * @param $entity
     * @return array
     */
    public function checkGetDataType($entity)
    {
        $msg = '';
        $userData = [];
        $dataTypeArr = ['items', 'user', 'company'];
        if (!isset($entity['get_data_type']) || !in_array($entity['get_data_type'], $dataTypeArr)) {
            $msg = '无效的get_data_type';
        }
        if ($entity['get_data_type'] == 'items' && empty($entity['items_dirname'])) {
            $msg = '请添加项目items_dirname';
        } else { //查公司或用户
            if (!empty($entity['_'])) {
                $userData = Token::getUserGreps(['key_name' => $entity['_']]);
//                $userData['user_id'] = '1';
//                $userData['user_type'] = '2';
//                $userData['company_id'] = '1';
            } else {
                $msg = '请添加token';
            }
        }
        return array('msg' => $msg, 'data' => $userData);
    }
    
}
