<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 流年 <liu21st@gmail.com>
// +----------------------------------------------------------------------

// 应用公共文件

/**中英文排序函数
 **/
// 异常错误报错级别,
error_reporting(E_ERROR | E_PARSE);

use think\Db;

function utf8_array_asort(&$array)
{
    if (!isset($array) || !is_array($array)) {
        return false;
    }
    foreach ($array as $k => $v) {
        $array[$k] = iconv('UTF-8', 'GBK//IGNORE', $v);
    }
    asort($array);
    foreach ($array as $k => $v) {
        $array[$k] = iconv('GBK', 'UTF-8//IGNORE', $v);
    }
    return true;
}

/**
 * 二维数组排序
 * @param $list '二位数组
 * @param $cn '是否为中文 1：中文， 2：英文/数字
 * @param $sortKey '排序字段
 * @param $order '正序/倒序 1：正， 2：倒
 */
function utf8sort($list, $sortKey, $order = 1)
{
    $direction = $order === 1 ? SORT_ASC : SORT_DESC;
    if (empty($list) || empty($sortKey)) {
        throw new Exception('lost params');
    } else {
        //检查编码
        foreach ($list as $k => &$v) {
            $encode = mb_detect_encoding($v[$sortKey], array("ASCII", 'UTF-8', "GB2312", "GBK", 'BIG5'));
        }
        if ($encode !== 'UTF-8') {
            foreach ($list as $k => &$v) {
                iconv($encode, 'UTF-8//IGNORE', $v[$sortKey]);
            }
        }
        $mark = array_column($list, $sortKey);
        array_multisort($mark, $direction, $list);
        if ($encode !== 'UTF-8') {
            foreach ($list as $k => &$v) {
                iconv('UTF-8', $encode . '//IGNORE', $v[$sortKey]);
            }
        }
        return $list;
    }

}

/**加密邮箱手机号*/
function encrypt($data)
{
    $self_key = 'kangyun3d';
    $key = md5($self_key);//md5加密key
    $x = 0;
    $b = '';
    $str = '';
    $len = strlen($data);
    $l = strlen($key);
    // var_dump($key.'<br>');
    /**
     * for循环 从0开始 条件小于密码的长度
     * 如果当变量x等于加密后md5的长度 $x =0
     * 否则 $B 拼接上加密的md5里的$x
     */
    for ($i = 0; $i < $len; $i++) {
        if ($x == $l) {
            $x = 0;
        } else {
            $b .= $key[$x];
            $x++;
        }
    }

    for ($i = 0; $i < $len; $i++) {
        // $s= $data[$i] ^ $b[$i];
        $s = $data[$i] . $b[$i];
        $str .= $s;
    }
    return base64_encode($str);
}

/*
 * 密码解密
 * *
 */
function decrypt2($data)
{
    if (empty($data)) {
        return ['code' => '参数为空', 'error' => 301];
    } else {
        $self_key = 'kangyun3d';
        $key = md5($self_key);
        $data = base64_decode($data);

        $newstr = '';
        for ($i = 0; $i < strlen($data); $i++) {
            if ($i % 2 == 0) {
                $newstr .= $data[$i];
            }
        }
        return $newstr;

        // $data = base64_decode($data);
        // $new_password = '';
        // for($i=0;$i<strlen($data);$i++){
        //     if($i % 2==0){
        //         $new_password .= $data[$i];
        //     }
        // }
        // return $new_password;
    }
}

/**
 * 生成加密的token
 * api == 200
 * $user_phone == 用户手机号
 */
function entoken($api, $user_phone)
{
    $api_token = $api;

    if ($api_token) {

        $private_key = 'kangyun3d';
        $user_account = $user_phone;
        $random_key = time();
        $md5_privately = md5($private_key);
        $temporary = $user_account . $random_key;

        $x = 0;
        $b = '';
        $l = strlen($private_key);

        for ($i = 0; $i < strlen($private_key); $i++) {
            if ($x == $l) {
                $x = 0;
            } else {
                $b .= $md5_privately[$x];
                $x++;
            }
        }

        $str = '';
        for ($m = 0; $m < strlen($temporary); $m++) {

            if (isset($b[$m])) {
                $v = $b[$m];
            } else {
                $v = null;
            }
            $s = $temporary[$m] . $v;
            $str .= $s;
        }
        $res = base64_encode($str);
        return $res;
    } else {
        $res = '参数错误';
        return $res;
    }
}

//退出登录
function signout($phone)
{
    if (!empty($phone)) {
        $redis = new \redis();
        $redis->connect('127.0.0.1', 6379);
        $redis->auth('kangyun888');
        $redis->select(1);
        $status = $redis->del($phone);
        return $status;
    }

}

//检查状态码 返回结果
function check_code($code)
{
    if (!empty($code)) {

        if ($code == 6403) {
            $status = ['code' => 6403, 'info' => '验证token不相等请检查是否不法操作'];;
        }

        if ($code == 6404) {
            $status = ['code' => 6404, 'info' => '验证token失效请重新登录'];
        }
        if ($code == 6200) {
            $status = ['code' => 6200, 'info' => '验证token有效'];
        }
        if ($code == 6401) {
            $status = ['code' => 6401, 'info' => '登录异常请使用手机加验证码登录'];
        }
        return $status;
    }

}

//连接redis
function connect_redis($warehouse)
{
    $redis = new \redis();
    $redis->connect('127.0.0.1', 6379);
    $redis->auth('kangyun888');
    $redis->select($warehouse);
    return $redis;

}

/**
 *
 * function encrypt (pwd) {
 * const privateKey = MD5('kangyun3d')
 * let x = 0
 * let currentPrivateKey = ''
 * let currentPwd = ''
 *
 * for (let i = 0; i < pwd.length; i++) {
 * if (x === privateKey.length) {
 * x = 0
 * } else {
 * currentPrivateKey += privateKey[x]
 * x++
 * }
 * }
 *
 * for (let i = 0; i < pwd.length; i++) {
 * const str = pwd[i] + currentPrivateKey[i]
 * currentPwd += str
 * }
 * return Base64.encode(currentPwd)
 * }
 */

function encrypt_qianduan($pwd)
{ //模拟前端加密方式
    $kangyun = md5("kangyun3d");

    $re_str = '';
    for ($i = 0; $i < strlen($pwd); $i++) {
        $re_str .= ($pwd[$i] . $kangyun[$i]);
    }

    return base64_encode($re_str);

}

function decrypt($re_str)
{ //解密前端的内容
    $base_de_str = base64_decode($re_str);

    $newstr = '';
    for ($i = 0; $i < strlen($base_de_str); $i++) {
        if ($i % 2 == 0) {
            $newstr .= $base_de_str[$i];
        }
    }
    return $newstr;

}

/**
 * 输出多少天前的0点
 * @param $day 天数
 * @return false|float|int
 */
function midnightBefore($day)
{
    $dateStamp = (strtotime(date('Y-m-d', time())) - ($day * 24 * 60 * 60)) - 28800;
    return $dateStamp;
}

/**
 * 计算传入时间戳至今天数
 * @param $time
 * @return float|int
 */
function computeDaysTillNow($time)
{
    $dateStamp = (strtotime(date('Y-m-d', $time))) - 28800;
    $dateStampNow = (strtotime(date('Y-m-d', time()))) - 28800;
    $res = ($dateStampNow - $dateStamp) / 86400;
    return $res;
}


function getNames($param)
{
    $where = [];
    foreach ($param as $k => $v) {
        $where[] = $v['user_id'];
    }
    $nameRaw = Db::table('user')->where('id', 'in', $where)->field('id,firstname,lastname')->select();
    if (count($nameRaw) != 0) {
        foreach ($param as $pk => &$pv) {
            foreach ($nameRaw as $k => $v) {
                if ($pv['user_id'] === $v['id']) {
                    $pv['first_name'] = $v['firstname'];
                    $pv['last_name'] = $v['lastname'];
                } else {
                    $pv['first_name'] = $pv['last_name'] = "";
                }
            }
        }
    } else {
        foreach ($param as $pk => &$pv) {
            $pv['first_name'] = $pv['last_name'] = "";
        }
    }

    return $param;
}

/**
 * 获取用户真实地址（代码来自php官网文档下方留言）
 * @return mixed
 */
function real_ip()
{
    /*
Sometimes you will find that your website will not get the correct user IP after adding CDN, then this function will help you
*/
    $ip = $_SERVER['REMOTE_ADDR'];
    if (isset($_SERVER['HTTP_X_FORWARDED_FOR']) && preg_match_all('#\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}#s', $_SERVER['HTTP_X_FORWARDED_FOR'], $matches)) {
        foreach ($matches[0] AS $xip) {
            if (!preg_match('#^(10|172\.16|192\.168)\.#', $xip)) {
                $ip = $xip;
                break;
            }
        }
    } elseif (isset($_SERVER['HTTP_CLIENT_IP']) && preg_match('/^([0-9]{1,3}\.){3}[0-9]{1,3}$/', $_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (isset($_SERVER['HTTP_CF_CONNECTING_IP']) && preg_match('/^([0-9]{1,3}\.){3}[0-9]{1,3}$/', $_SERVER['HTTP_CF_CONNECTING_IP'])) {
        $ip = $_SERVER['HTTP_CF_CONNECTING_IP'];
    } elseif (isset($_SERVER['HTTP_X_REAL_IP']) && preg_match('/^([0-9]{1,3}\.){3}[0-9]{1,3}$/', $_SERVER['HTTP_X_REAL_IP'])) {
        $ip = $_SERVER['HTTP_X_REAL_IP'];
    }
    return $ip;

}

/**
 * 字符串长度处理函数
 * @str 字符串
 * @menlen需要判断的最小长度
 * @maxlen最大长度
 **/
function getSterlen($str = '', $menlen = 2, $maxlen = 25)
{
    if (empty($str)) {
        return 407;
    }
    $len = strlen($str);
    if ($len < $menlen) {
        return 407;
    }
    if ($len > $maxlen) {
        return 408;
    }
    return 200;
}


function com_this_week_time( $now_time = '' ){
    //设置一周的时间

    if($now_time == '' ){
        $now_time = time(); 
    }
    $one_day = 1 * 24 * 60 * 60 ; // 1天的时间 单位秒
    $week_day = intval(date("N" , $now_time)) ;//本周几 1~7 7是周日
    
    $monday_time =  ($now_time - (  ($week_day -1) * $one_day)  )  ;
    $sunday_time = $monday_time + ( 6 * $one_day ) ;

    $week_date = [];
    for($i = 0 ; $i< 7;$i++){ //一周的日期列表 周一到周日
        $temp = [];
        $temp_time = $monday_time + ( $i * $one_day ) ;
        $temp['date'] = date('Y-m-d' , $temp_time ); //日期  例如：2019-02-08
        $temp['week_day'] = intval(date("N" , $temp_time)) ; //本周几 1~7 7是周日
        $temp['date_int'] = intval( date('Ymd' , $temp_time )); //日期  例如：20190208
    
        array_push($week_date , $temp  ) ;
    }

    $now_time_date = date('Y-m-d' , $now_time);
    $now_time_date_int = date('Ymd' , $now_time);

    $monday_time_date = date('Y-m-d' , $monday_time);
    $monday_time_date_int = date('Ymd' , $monday_time);
    
    $sunday_time_date = date('Y-m-d' ,  $sunday_time);   //2019-02-08
    $sunday_time_date_int = date('Ymd' ,  $sunday_time); //20190208

    return [
        'now_time' =>$now_time, //当前的时间戳
        'monday_time' =>$monday_time, //周一时间戳
        'sunday_time' =>$sunday_time, //周日时间戳
        'now_time_date' =>$now_time_date, //今天日期
        'now_time_date_int' =>$now_time_date_int, //今天日期 20190201
        'monday_time_date' =>$monday_time_date, //周一日期 2019-02-01
        'sunday_time_date' =>$sunday_time_date, //周日日期
        'monday_time_date_int' =>$monday_time_date_int, //周日日期 20190201
        'sunday_time_date_int' =>$sunday_time_date_int, //周日日期
        'week_day' =>$week_day, //本周的第几天
        'week_date'=>$week_date, //二维数组
        
    ];
}

/**
 * 公共接口操作返回
 * @author tanhuaxin
 * @param int $code
 * @param string $msg
 * @param array $data
 * @return false|string
 */
function json_return($code = 0, $msg = 'success',  $data = array())
{
    $tmp['code'] = $code;
    $tmp['msg'] = $msg;
    $tmp['data'] = $data;
    return json_encode($tmp);
}

/*
    //为每天数据添加默认的值 ，主要是一周的数据  获取设备类型等数据
    param $label string 名称
    param $default_num string 需要修改或添加默认值的数据
    param $one_week_data = [] array() 一周的数据

    return data
    $return_data = [
        'code'=>0, //非 0 不成功
        'message' => 'is success!'
        'data'=>[
            'one_week_data'=>[], //处理添加了默认没有的一周数据  //
            'one_week_all_arr_type'=>[ //为每种类型添加个数字 label_type //多维
                'index' =>[],
                'utf_8' =>[],
            ],
            'one_week_all_arr'=>[], //一周访问的所有类型   //一维
            'one_week_data_'.$label_type.'_asc' =>[], //一周将 $lable_type 正序排列   //一维
        ],
         
    ];
*/
function com_one_week_data_all_type_list(    $one_week_data = [], $label='', $default_num = '' ){
    if($label == ''){
        return ['code'=> 1 ,'message'=>'label is must' , 'data'=>[]];
    }
    if($default_num == '' ){
        return ['code'=> 1 ,'message'=>'default_num is must' , 'data'=>[]];
    }
    if( !is_array( $one_week_data )){
        return ['code'=> 1 ,'message'=>'one_week_data is array' , 'data'=>[]];
    } 

    $label_type = $label . '_type';
     
    $return_data = [
        'code'=>0, //非 0 不成功
        'message' => 'is success!',
        'data'=>[
            'one_week_data'=>[], //处理添加了默认没有的一周数据  //
            'one_week_all_arr_type'=>[ //为每种类型添加个数字 label_type //多维
            'index' =>[],
            'utf_8' =>[],
                ],
            'one_week_all_arr'=>[], //一周访问的所有类型   //一维
            'one_week_data_'.$label_type.'_asc' =>[], //一周将 $lable_type 正序排列   //一维
        ],      
    ];
    
    $one_week_all_arr = [];
    $data = [];
    foreach( $one_week_data as $k_date =>$v_date_data){ //$k = [2019-02-03,2019-02-04,.......]
        foreach($v_date_data as $v_index => $v_data){
            array_push($one_week_all_arr , $v_data[$label]);
        }
    }
    
    $one_week_all_arr = array_unique($one_week_all_arr); //去重  一周访问的所有类型
    $one_week_all_arr = array_merge( $one_week_all_arr , [] ); //下标重排

    $get_data['one_week_all_arr'] = $one_week_all_arr;
    $one_week_all_arr_type = [ //为每种类型添加个数字 label_type
        'index' =>[],
        'utf_8' =>[],
    ]; 

    //为每种添加个类型
    for($i = 0; $i < count($one_week_all_arr); $i++ ){ //初始化每天的数据
        $one_week_all_arr_type['utf_8'][$one_week_all_arr[$i]][ $label] =  $one_week_all_arr[$i];
        $one_week_all_arr_type['utf_8'][$one_week_all_arr[$i]][ $label_type ] =   ($i+1) ;
    
        $one_week_all_arr_type['index'][$i][ $label] =  $one_week_all_arr[$i];
        $one_week_all_arr_type['index'][$i][ $label_type ] =   ($i+1) ;            
    }

    $get_data['one_week_all_arr_type'] =  $one_week_all_arr_type ;

    $get_data['one_week_data_'.$label_type.'_asc'] = [];//按label_type的值正序排

    foreach( $one_week_data as $k_date => $v_date_data ){ 
        $temp_one_week_to_one_day_data =  $one_week_all_arr_type['utf_8'] ;
        
        
        $temp_one_day_has_data = [];
        foreach($v_date_data as $v_index => $v_data){ 
            if( isset(  $temp_one_week_to_one_day_data[$v_data[ $label]] )){ //如果有该类型的下标  
                $temp  = [];
                $temp[ $label] =  $v_data[ $label] ;
                $temp[$label_type] =  $temp_one_week_to_one_day_data[$v_data[ $label]][$label_type] ;
                $temp[$default_num ] =  $v_data[$default_num] ;
               // $temp['nb_visits'] =  $v_data['nb_visits'] ;

                array_push( $temp_one_day_has_data , $temp );
                unset( $temp_one_week_to_one_day_data[$v_data[$label]]); //去除当天有的数据
            }
        } 

        $temp_one_day_no_has_data = [];  //当天没有的数据
        foreach($temp_one_week_to_one_day_data as $v_index => $v_data){ //将某天没有的数据添加上
                $temp  = [];
                $temp[$label] =  $v_data[$label] ;
                $temp[$label_type] =  $v_data[$label_type] ;
                $temp[$default_num] =  0 ;

                array_push( $temp_one_day_no_has_data ,  $temp ); 
        } 
        $one_week_data[$k_date] = [];
        $one_week_data[$k_date] = array_merge( $temp_one_day_has_data ,  $temp_one_day_no_has_data);
        $get_data['one_week_data'][$k_date] = $one_week_data[$k_date];

        $arr = $one_week_data[$k_date];
        array_multisort(array_column($arr, $label_type ),SORT_ASC,$arr);    //将 $lable_type 正序排列

        $get_data['one_week_data_'.$label_type.'_asc'][$k_date] = $arr ;  
    } 
 
    $return_data['data'] = $get_data; 
    return $return_data;
}

?>