<?php

namespace app\statisticstest\controller;
use think\Db;
use app\common\Token;

class Comment { 
    //评论，点赞 等
    //项目点赞
    public function praise() {   
        $dirname =  input('param.dirname');
        $tb_field = 'praise';  //点赞字段
         if (empty( $dirname)) { 
            return json(['data' => [], 'code' =>416, 'message' => '路径缺失']);  
         } 
         $cookie = cookie('praise_' . $dirname);  
        if (empty($cookie)) {
            $time = time();
            $date = date('Ymd', $time);  
            $cut_off_date = strtotime($date) + (24 * 60 * 60); 
            $cookie_time = $cut_off_date - $time;
            $value = base64_encode(base64_encode($time));
            cookie('praise_' . $dirname, $value, $cookie_time);
            Db::startTrans();//开启事务
            try{ 
            $judgement = Db::table('items')->where(['dirname' => $dirname])->field('id,dirname,user_id,company_id')->find();
            $dirname = $judgement['dirname'];
            $user_id = $judgement['user_id'];
            $company_id = $judgement['company_id'];  //print_r($judgement);die;
            if (!$judgement) {
                return json(['data' => [], 'code' => 410, 'message' => '路径不存在']);  
            }
            Db::table('items')->where(['dirname' => $dirname])->setInc($tb_field);
            //items_praise 每天点赞
            $judgement = Db::table('items_praise')->where(['items_dirname' => $dirname])->where(['opreation_date' => $date])->find();  
            if (empty($judgement)) {
                $data = array('items_dirname' => $dirname, 'opreation_date' => $date, 'praise_sum' => 1);
                Db::table('items_praise')->insert($data); 
            } else {
                Db::table('items_praise')->where(['items_dirname' => $dirname])->where(['opreation_date' => $date])->setInc('praise_sum'); 
            }
            //items_praise_company 公司点赞
            $judgement_one = Db::table('items_praise_company')->where(['company_id' => $company_id])->where(['opreation_date' => $date])->find();  
            if (empty($judgement_one)) {
                 $data = array('company_id' => $company_id, 'opreation_date' => $date, 'praise_sum' => 1);
                 Db::table('items_praise_company')->insert($data); 
            } else {
                Db::table('items_praise_company')->where(['company_id' => $company_id])->where(['opreation_date' => $date])->setInc('praise_sum'); 
            }
            //items_praise_user 用户点赞
            $judgement_two = Db::table('items_praise_user')->where(['user_id' => $user_id])-> where(['opreation_date' => $date])->find();  
            if (empty($judgement_two)) {
                $data = array('user_id' => $user_id, 'opreation_date' => $date, 'praise_sum' => 1 );
                Db::table('items_praise_user')->insert($data); 
            } else {
                Db::table('items_praise_user')->where(['user_id' => $user_id])->where(['opreation_date' => $date])->setInc('praise_sum'); 
            }
             Db::commit();
             } catch (\Exception $e) {
             // Log::write('action:praise'.'dirname:'.$dirname.'操作的表:items' ,'notice');
                Db::rollback();
                $data = ['date'=>[], 'code' => 500, 'message'=>'未知错误，点赞失败']; 
                return json($data);
           }  
                $data = ['data' =>[], 'code' =>200, 'message' =>'点赞成功'];
        } else {
            //$data = ['data' =>[] , 'code' =>202 ,'message' =>'您已点赞了，不能重复点赞呢'];
            //新改 项目取消点赞
            try{
                Db::startTrans();//开启事务
                // 删除
                cookie( 'praise_' . $dirname, null);
                $get_items = Db::table('items')->where(['dirname' => $dirname])->field('id,dirname,user_id,company_id')->find();
                if (empty($get_items)) {
                    return ['data' => [], 'code' => 410, 'message' => 'dirname 不存在'];
                }
                $date = intval(date("Ymd", time()));
                //数据库点赞减一
                Db::table('items_praise')->where(['items_dirname' => $dirname])->where(['opreation_date' => $date])->setDec('praise_sum');
                Db::table('items_praise_user')->where(['user_id' => $get_items['user_id'] ])->where(['opreation_date' => $date])->setDec('praise_sum');
                Db::table('items_praise_company')->where(['company_id' => $get_items['company_id']])->where(['opreation_date' => $date])->setDec('praise_sum');
                Db::commit(); 
                $data = ['data' => [], 'code' => 200, 'message'=>'取消点赞成功！'];
            } catch (\Exception $e) {
                Db::rollback();
                $data = [ 'data' => [], 'code' => 401, 'message'=>'操作异常！'];
            }
        }
        return json($data); 
    }


    //项目取消点赞（弃用）
    /* public function remove_praise(){
        try{
            $dirname =  input('param.dirname');
           
            if ( empty( $dirname ) ){ 
              echo json_encode([ 'data' =>[] , 'code' =>416,'message'=>'请输入要取消点赞的 dirname'] ,JSON_UNESCAPED_UNICODE );  
              exit;
            } 
            $cookie = cookie('praise_'. $dirname);  
            if( empty( $cookie )  ){
                echo json_encode([ 'data' =>[] , 'code' =>202,'message'=>'你还没有点赞！']  ,JSON_UNESCAPED_UNICODE);  
                exit;
            }

            Db::startTrans();//开启事务
            // 删除
            cookie( 'praise_'. $dirname , null);
            //数据库点赞减一
            Db::table('items_praise') -> where( ['items_dirname' => $dirname] ) -> where(['opreation_date' => $date]) ->setDec('praise_sum');
            Db::table('items_praise') -> where( ['items_dirname' => $dirname] ) -> where(['opreation_date' => $date]) ->setDec('praise_sum');
            Db::table('items_praise') -> where( ['items_dirname' => $dirname] ) -> where(['opreation_date' => $date]) ->setDec('praise_sum');

            Db::commit(); 
            $data = [ 'data' =>[] , 'code' =>200,'message'=>'取消点赞成功！' ];
        }catch(\Exception $e){
            Db::rollback();
            $data = [ 'data' =>[] , 'code' =>401,'message'=>'操作异常！' ];
        }


            echo json_encode($data ,JSON_UNESCAPED_UNICODE );
        
    } */






    /*从畅言得到的评论回推地址 http://changyan.kuaizhan.com/setting/common/further
        每次评论都有一条信息
        此地址，畅言将在每条评论发表后，向您提供的地址推送一份数据，
    */
    public function  save_changyan_new_comment_message() {
        $message = input('param.data') ; //从畅言中获取的数据
        $message2 = json_decode($message, true); //字符串转数组
        $ctime = str_replace('000', '', $message2['comments'][0]['ctime']);  // 评论时间
        $items_dirname =  $message2['sourceid']; //项目目录名
        $today_date = intval(date('Ymd', $ctime ));  // 20190205,当天日期
        try{
            Db::startTrans();
            $find_items = Db::table('items')->where(['dirname' =>  $items_dirname,])->field('id,company_id,user_id')->find(); //想查找是否有该项目           
            if (empty($find_items)) { //没有项目，不做存储
                throw new \Exception('no items_dirname');
            } else {
                $items_id = $find_items['id'];
                $user_id = $find_items['user_id'];
                $company_id = $find_items['company_id']; 
                //找公司
                $get_company_data = Db::table('items_comment_changyan_company')->where(['company_id' =>  $company_id, 'opreation_date' => $today_date, ])->find();
                if (empty($get_company_data)) { //证明当天该公司的项目都没有评论
                    $first_company_add_data = [
                        'company_id' =>  $company_id,
                        'opreation_date' =>  $today_date,
                        'comment_sum' => 1, //公司第一次存储
                    ];
                    Db::table('items_comment_changyan_company')->insert($first_company_add_data); //公司
                    unset($first_company_add_data);
                } else {//该公司当天有评论
                    //自增公司
                    Db::table('items_comment_changyan_company')->where(['company_id' =>  $company_id, 'opreation_date' =>  $today_date, ])->setInc('comment_sum',1); //添加公司               
                }
                //找user
                $get_user_data = Db::table('items_comment_changyan_user')->where(['user_id' =>  $user_id, 'opreation_date' =>  $today_date,])->find();
                if (empty($get_user_data )) { //证明当天该用户的项目都没有评论
                     $first_user_add_data = [
                         'user_id' =>  $user_id,
                         'opreation_date' =>  $today_date,
                         'comment_sum' => 1, //第一次存储
                     ];
                     Db::table('items_comment_changyan_user')->insert($first_user_add_data); //公司
                    unset($first_user_add_data);
 
                } else { 
                     //该用户当天有评论
                     //自增user
                     Db::table('items_comment_changyan_user')->where(['user_id' =>  $user_id, 'opreation_date' =>  $today_date, ])->setInc('comment_sum',1); //添加用户                 
                }
                //  (items)
                $get_items_data = Db::table('items_comment_changyan')->where(['items_dirname' =>  $items_dirname, 'opreation_date' =>  $today_date, ])->find();             
                if (empty($get_items_data)) { //如果没有，证明今天还没有评论
                    $first_items_add_data = [
                        'items_dirname' => $items_dirname,
                        'opreation_date' => $today_date,
                        'comment_sum' => 1, //第一次存储
                    ];
                    Db::table('items_comment_changyan')->insert($first_items_add_data);
                    unset($first_items_add_data);
                } else { //今天非第一次评论
                    Db::table('items_comment_changyan')->where(['items_dirname' =>  $items_dirname, 'opreation_date' =>  $today_date, ])->setInc('comment_sum',1); //添加项目
                }
                // 提交事务
                Db::commit();       
            }
        } catch (\Exception $e) {
            // 回滚事务
            Db::rollback();
        }
    }

    public function return_data_to_items_from_get_week_comment($entity_param = '') {
        //return $this->get_week_comment($entity_param );
    }

    //获取项目的评论条数
    public function get_week_comment($entity_param = '') {
        //设置默认天数
        $now_time = time();
        $today_date_int = date('Ymd',$now_time);
        //$today_time = date("Y-m-d", $now_time  );
       // $yesterday_time = date("Y-m-d",($now_time - 60*60*24)); //昨天
        $return_data = array(
            'data' => [],
            'message' => '',
            'code'=> 201,
        );
        try{
            if (empty($entity_param)) {
                $entity_param = input('param.');
            } else {

            }
            //$where_data_type =[];
            if (empty($entity_param['get_data_type'])) {
                $entity_param['get_data_type'] = 'items';
            } else {
                if ($entity_param['get_data_type'] == 'company' || $entity_param['get_data_type'] == 'user') {
                    if (!empty($entity_param['_'])) { //需要传入token值
                        $userData = Token::getUserGreps(['key_name' => $entity_param['_']]);
                        //$userData['company_id']  $userData['user_id']
                    } else {
                        throw new \Exception('请添加token');
                    }
                } else if ($entity_param['get_data_type'] == 'items') {

                } else {
                    throw new \Exception('传入的get_data_type'. $entity_param['get_data_type'] . '  不对！');
                }
            }
                $get_week = com_this_week_time($now_time); //返回一周的日期
                $date_array = [];
                $one_week_data = [];
                foreach ($get_week['week_date'] as $kk => $vv_date) {
                    if ($vv_date['date_int'] <= $today_date_int) {  //记录到今天的日期
                        array_push($date_array, $vv_date['date_int']); 
                    }                 
                    $temp = [];
                    // $temp['date_int'] = $vv_date['date_int'];
                    $temp['date'] = $vv_date['date']; //2019-02-05
                    $temp['week_day'] = $vv_date['week_day']; // 5
                    $temp['comment_sum'] = 0; //初始化
                    $one_week_data[$vv_date['date_int']] =  $temp;
                }
                if ($entity_param['get_data_type'] == 'items') {
                    if (empty( $entity_param['items_dirname'] )) { //如果没有项目目录
                        throw new \Exception('请传入 items_dirname');
                    }
                    //641b3ad9547fbd821d764372e150c7ac
                    $data = Db::table('items_comment_changyan')->where('opreation_date','in',$date_array)->where(['items_dirname' => $entity_param['items_dirname'] ])->select();
                } else if ($entity_param['get_data_type'] == 'user') { //查询user的访问
                    $data = Db::table('items_comment_changyan_user')->where('opreation_date','in',$date_array)->where([ 'user_id' => $userData['user_id']])->select();
                } else if ($entity_param['get_data_type'] == 'company'){//查询公司的访问
                    $data = Db::table('items_comment_changyan_company')->where('opreation_date','in',$date_array)->where([ 'company_id' => $userData['company_id']])->select();
                }
                foreach ($data as $kkkk => $vvvv) {
                    $one_week_data[$vvvv['opreation_date']]['comment_sum'] = $vvvv['comment_sum'];//每天的评论数
                }
                $return_data = [
                    'message' => '获取 ' . $entity_param['get_data_type'] . ' 成功！' ,
                    'code' => 200,
                    'data' =>[
                        'one_week_data'=>$one_week_data
                    ],
                ];
        } catch (\Exception $e) {
            $return_data = [
                'message' => $e->getMessage(),
                'code' => 401,
                'data' =>[],
            ];
        }
        return $return_data; 
    } 
    
    /*
    * 一周的日期
    *
    * @author      TD
    * @parameter  $time  timestamp 时间戳格式
    * @parameter  $type   mixed    type空值 返回 20190307 这种int类型数据 ，type非空，返回1551715200 这种时间戳类型数据 
    * @return     $day    array 
    */
    protected function weekInterval( $time = '', $type = '') {
            $time = $time?$time:time(); 
            $day_on = intval(date('w', $time)); //一周中的第几天 ,0表示周日，往前查的天数
            $time =strtotime(date('Ymd', $time));
            $day_on = ($day_on == 0)?7:$day_on;
            $one_day_seconds = 24 * 60 * 60;
            $start_day = $time - ($day_on - 1) * $one_day_seconds;
            $day = array();
            for ($i = 0;$i<=6;$i++) {
                $day[] =  $i * $one_day_seconds + $start_day;
            }
            if (empty($type)) {
                foreach ($day as $key => $value) {
                    $day[$key] = date('Ymd', $value );
                }
            }
                return $day;
    }

    /*
    * 点赞逻辑检查
    *
    * @author      TD
    * @parameter  get_data_type  string items|user|company  数据类型
    * @parameter  items_dirname   string  项目路径名 当get_data_type = items时必须
    * @parameter   _               string  token的验证码,当get_data_type = user|company时必须
    * @return     array    code     状态码
    * @return     array   message    信息
    * @return     array    data     返回的数据 
    */
    protected function praiseLogicCheck($data = '') {
        empty($data['get_data_type']) && $data['get_data_type'] = 'items';  
        switch ($data['get_data_type']) {
            case 'company':
            case 'user':
                if (empty( $data['_'])) {
                    $userData['code'] = 403;
                    $userData['message'] = 'token缺失';
                    break;
                }   
                $tokenData = Token::getUserGreps(['key_name' => $data['_']]); 
                if (!isset($tokenData['user_id']) || !isset($tokenData['company_id'])) {
                    $userData['code'] = 401 ;
                    $userData['message'] = 'token无效';
                    break;
                }
                $judgement =  Db::table('items_praise_company')->where('company_id', $tokenData['company_id'])->find();
                $judgement_two = Db::table('items_praise_user')->where('user_id', $tokenData['user_id'])->find();
                if (empty($judgement) || empty($judgement_two)) {
                    $userData['code'] = 204;
                    $userData['message'] = '数据不存在';
                } else {
                    $userData['data']['type'] = $data['get_data_type'];
                    $userData['data']['company_id'] = $judgement['company_id'];
                    $userData['data']['user_id'] = $judgement_two['user_id'];
                    $userData['code'] = 200;
                    $userData['message'] = '获取成功'; 
                    $userData = array_filter($userData);//去空值
                }  
                break;
            case 'items':
                if (empty($data['items_dirname'])) {
                    $userData['code']= 204 ;
                    $userData['message'] = '路径不能空';
                } else {
                    $judgement = Db::table('items_praise')->where('items_dirname', $data['items_dirname'])->find();
                    if ($judgement) {
                        $userData['code'] = 200 ;
                        $userData['message'] = '获取成功';
                        $userData['data']['type'] = $data['get_data_type'];
                        $userData['data']['dirname'] = $judgement['items_dirname'];
                    } else {
                        $userData['code'] = 204 ;
                        $userData['message'] = '路径不存在';
                    }
                }
                break;
            default:
                $userData['code'] = 401 ;
                $userData['message'] = '传入的get_data_type'. $data['get_data_type'] . ' 不正确！';
        }   
            $userData['data'] = isset($userData['data'])?$userData['data']:array();
        return $userData ;
    }

    /*
     * 一周点赞统计
     *
     * @author TD
     * @parameter  get_data_type  string items|user|company  数据类型
     * @parameter  items_dirname   string  项目路径名 当get_data_type = items时必须
     * @return     array    code     状态码
     * @return     array   message    信息
     * @return     array    data     返回的数据 
     */
    public function praiseWeekStatistics() {
        try{ 
            $data = input('param.');
            $time = isset($data['time'])?$data['time']:time(); 
            $oneWeek = $this->weekInterval($time);//一周七天的日期
            $userData = $this->praiseLogicCheck($data);//用户数据检测
            $start_day = array_slice($oneWeek, 0, 1);//周一 日期
            $end_day = array_slice($oneWeek, -1, 1 );//周日 日期
            $start_day = $start_day[0]; //换成 string
            $end_day = $end_day[0];   
           if ($userData['code'] != 200) {
                return  $userData;
           } //return 是会禁止后段代码的执行（非错误代码） ， 非200 为失败；
           if (!empty($userData)) {
                if ($userData['data']['type'] == 'company') {
                    $praise_data = Db::table('items_praise_company')->where('opreation_date' , 'between' ,"$start_day,$end_day" )->where('company_id', $userData['data']['company_id'])->column('opreation_date,praise_sum');
                } elseif ($userData['data']['type'] == 'user') {
                    $praise_data = Db::table('items_praise_user')->where('opreation_date' , 'between' ,"$start_day,$end_day" )->where('user_id' , $userData['data']['user_id'])->column('opreation_date,praise_sum');
                } elseif ($userData['data']['type'] == 'items') {
                    $praise_data = Db::table('items_praise') -> where('opreation_date' , 'between' ,"$start_day,$end_day" )->where('items_dirname', $userData['data']['dirname'])->column('opreation_date,praise_sum');
                }
            }
            // 处理格式  对日期的‘-’ 不用计算类的函数，用正则处理
            foreach ($oneWeek as $k => $v) {
                $array[$v]['date'] = preg_replace('/^(\d{4})(\d{2})(\d{2})$/', '${1}-${2}-${3}', $v);
                $array[$v]['week_day'] = $k + 1;
                $array[$v]['praise_sum'] = isset($praise_data[$v])?$praise_data[$v]:0;  
            }
            $result = array(
                'message' => '获取成功',
                'code' => 200 ,
                'data' => array(
                    'one_week_data' => $array
                )
            );
           return  $result;
        } catch (\Exception $e) {
           return ['code' => 416, 'message' =>'参数缺失或参数不正确', 'data' => array()];
        }
    }

    /*
     * 数据统计
     *
     * @author TD
     * @parameter  get_data_type  string items|user|company  数据类型
     * @parameter  items_dirname   string  项目路径名 当get_data_type = items时必须
     * @return     array    code     状态码
     * @return     array   message    信息
     * @return     array    data     返回的数据 
     * illustration  20190311 接口停止使用 ，多个接口数据带有exit ，token的验证函数需要重写 。
     */
    public function data_statistics() {
         return json(['code' => 405, 'message' => '接口停用', 'data' => array()]); exit;
         $siteName = 'https://todo.kangyun3d.cn/';
        // $siteName = 'localhost/public/';
         $field = input('param.');
         $data = array( 
            '_' => $field['_'],
            'items_dirname' => $field['items_dirname'],
            'get_data_type' => $field['get_data_type'],
         );
           $url = array( 
           'active_users_VisitorInterest' => array($siteName .'index.php/statistics/data/active_users_VisitorInterest'),
           'praiseWeekStatistics' => array($siteName .'index.php/statistics/comment/praiseWeekStatistics'),
            'all_VisitsSummary_get' => array($siteName .'index.php/statistics/data/all_VisitsSummary_get'),
            'one_day_week_VisitsSummary_getVisits' => array($siteName .'index.php/statistics/data/one_day_week_VisitsSummary_getVisits'),
             'get_week_comment' => array($siteName .'index.php/statistics/comment/get_week_comment'),
             'get_UserCountry_getCity' =>array($siteName .'index.php/statistics/location/get_UserCountry_getCity'),
             'items_send_sum' => array($siteName . 'index.php/statistics/data/items_send_sum'),
           );
         //去除连接时间限制       
          set_time_limit(0);
         foreach ($url as $k => $v) { 
               $curl = curl_init();
               //设置头文件数据流输出,会变成报文格式，数据量大需要开启，开启后要处理格式(格式未处理)
              // curl_setopt($curl, CURLOPT_HEADER, 1);
               //post形式发送
               curl_setopt($curl, CURLOPT_POST, TRUE);
               curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE );
               // 去除https验证
               curl_setopt( $curl, CURLOPT_SSL_VERIFYPEER, FALSE) ;
               curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
               //设置数据
               curl_setopt( $curl, CURLOPT_URL, $v[0]);
               curl_setopt( $curl, CURLOPT_POSTFIELDS, $data);
               //格式处理
              $datas = curl_exec($curl);
              $result[$k] = json_decode($datas, true);
              curl_close($curl);
         }
           $array = array(
            'code' => 200,
            'message' => '获取成功',
            'data' => $result,
           );
           return json($array);
    }

    //项目链接分享
    public function share_items_link() {
        $return_data = [
            'message' => '',
            'code' => 202,
            'data' => [],
        ];
        try{
            $entity = input('param.');
            if (empty($entity['dirname'])) {
                throw new \Exception('请添加参数 dirname');
            }
            //操作数据
            $items_dirname = $entity['dirname'];
            Db::startTrans();
            $find_items = Db::table('items')->where(['dirname' => $items_dirname,])->field('id,company_id,user_id')->find(); //想查找是否有该项目           
            if (empty($find_items)) { //没有项目，不做存储
                throw new \Exception('没有该项目');
            } else {
                $items_id = $find_items['id'];
                $user_id = $find_items['user_id'];
                $company_id = $find_items['company_id']; 
                $today_date = intval(date("Ymd" ,time())) ; //20190203
                $opreation_items_table = 'items_share'; //分享项目表
                $opreation_company_table = 'items_share_company'; //分享公司表
                $opreation_user_table = 'items_share_user'; //分享用户表
                //找公司
                $get_company_data = Db::table($opreation_company_table)->where(['company_id' =>  $company_id, 'opreation_date' => $today_date, ])->find();
                if (empty($get_company_data)) { //证明当天该公司的项目都没有分享
                    $first_company_add_data = [
                        'company_id' => $company_id,
                        'opreation_date' => $today_date,
                        'sum' => 1, //公司第一次存储
                    ];
                    Db::table($opreation_company_table)->insert($first_company_add_data); //公司
                    unset($first_company_add_data);
                } else {//该公司当天有分享
                    //自增公司
                    Db::table($opreation_company_table)->where([ 'company_id' => $company_id, 'opreation_date' => $today_date, ])->setInc('sum',1); //添加公司               
                }
                //找user
                $get_user_data = Db::table($opreation_user_table)->where(['user_id' =>  $user_id, 'opreation_date' => $today_date,])->find();
                if (empty($get_user_data)) { //证明当天该用户的项目都没有分享
                     $first_user_add_data = [
                         'user_id' => $user_id,
                         'opreation_date' => $today_date,
                         'sum' => 1, //第一次存储
                     ];
                     Db::table($opreation_user_table)->insert($first_user_add_data); //公司
                    unset($first_user_add_data);
                } else { //该用户当天有分享
                     //自增user
                     Db::table($opreation_user_table)->where(['user_id' =>  $user_id, 'opreation_date' => $today_date, ])->setInc('sum',1); //添加用户                 
                }
                //  (items)
                $get_items_data = Db::table($opreation_items_table)->where(['items_dirname' =>  $items_dirname, 'opreation_date' => $today_date, ])->find();             
                if (empty($get_items_data)) { //如果没有，证明今天还没有分享
                    $first_items_add_data = [
                        'items_dirname' => $items_dirname,
                        'opreation_date' => $today_date,
                        'sum' => 1, //第一次存储
                    ];
                    Db::table( $opreation_items_table)->insert($first_items_add_data);
                    unset($first_items_add_data);
                } else { //今天非第一次分享
                    Db::table( $opreation_items_table)->where(['items_dirname' => $items_dirname, 'opreation_date' => $today_date, ])->setInc('sum',1); //添加项目
                }
                // 提交事务
                Db::commit();       
            }
            $return_data = [
                'code'  => 200,
                'message'  => '分享成功！',
                'data' =>[]
                //'data'  => ['dirname' => $entity['dirname']],
            ];
        } catch (\Exception $e) {
            // 回滚事务
            Db::rollback();
            $return_data['message'] = $e->getMessage();
        }
        echo json_encode($return_data, JSON_UNESCAPED_UNICODE);
    }

    //项目拨打电话
    public function items_click_number() {
        $return_data = [
            'message' => '',
            'code' => 202,
            'data' => [],
        ];
        try{
            $entity = input('param.');
            if (empty($entity['dirname'])) {
                throw new \Exception('请添加参数 dirname');
            }
             //操作数据
            $items_dirname = $entity['dirname'];
             Db::startTrans();
             $find_items = Db::table('items')->where(['dirname' => $items_dirname, ])->field('id,company_id,user_id')->find(); //想查找是否有该项目           
             if (empty($find_items)) { //没有项目，不做存储
                 throw new \Exception('没有该项目');
             } else {
                 $items_id = $find_items['id'];
                 $user_id = $find_items['user_id'];
                 $company_id = $find_items['company_id']; 
                 $today_date = intval( date("Ymd" ,time())); //20190203
                 $opreation_items_table = 'items_click_number'; //拨打电话项目表
                 $opreation_company_table = 'items_click_number_company'; //拨打电话公司表
                 $opreation_user_table = 'items_click_number_user'; //拨打电话用户表
                 //找公司
                 $get_company_data = Db::table($opreation_company_table)->where([ 'company_id' =>  $company_id, 'opreation_date' =>  $today_date, ])->find();
                 if (empty( $get_company_data)) { //证明当天该公司的项目都没有拨打电话
                     $first_company_add_data = [
                         'company_id' => $company_id,
                         'opreation_date' => $today_date,
                         'sum' => 1, //公司第一次存储
                     ];
                     Db::table($opreation_company_table)->insert($first_company_add_data); //公司
                     unset($first_company_add_data);
                 }else{//该公司当天有拨打电话
                     //自增公司
                     Db::table($opreation_company_table)->where(['company_id' => $company_id, 'opreation_date' => $today_date, ])->setInc('sum',1); //添加公司               
                 }
                 //找user
                 $get_user_data = Db::table($opreation_user_table)->where([ 'user_id' =>  $user_id, 'opreation_date' =>  $today_date, ])->find();
                 if (empty($get_user_data)) { //证明当天该用户的项目都没有拨打电话
                      $first_user_add_data = [
                          'user_id' =>  $user_id,
                          'opreation_date' =>  $today_date,
                          'sum' => 1, //第一次存储
                      ];
                      Db::table($opreation_user_table)->insert($first_user_add_data); //公司
                     unset($first_user_add_data);
                 } else { //该用户当天有拨打电话
                      //自增user
                      Db::table($opreation_user_table)->where(['user_id' => $user_id, 'opreation_date' => $today_date, ])->setInc('sum',1); //添加用户                 
                 }
                 //  (items)
                 $get_items_data = Db::table($opreation_items_table)->where(['items_dirname' =>  $items_dirname, 'opreation_date' => $today_date, ])->find();             
                 if (empty($get_items_data)) { //如果没有，证明今天还没有拨打电话
                     $first_items_add_data = [
                         'items_dirname' => $items_dirname,
                         'opreation_date' => $today_date,
                         'sum' => 1, //第一次存储
                     ];
                     Db::table( $opreation_items_table)->insert($first_items_add_data);
                     unset($first_items_add_data);
                 } else { //今天非第一次拨打电话
                     Db::table($opreation_items_table)->where(['items_dirname' => $items_dirname, 'opreation_date' => $today_date, ])->setInc('sum',1); //添加项目
                 }
                 // 提交事务
                 Db::commit();       
             }
            $return_data = [
                'code'  => 200,
                'message'  => '拨打成功！',
                'data' =>[]
                //'data'  => ['dirname' => $entity['dirname']],
            ];
        } catch (\Exception $e) {
            // 回滚事务
            Db::rollback();
            $return_data['message'] = $e->getMessage();
        }
        echo json_encode($return_data , JSON_UNESCAPED_UNICODE);
    }

    //获取项目链接分享信息
    /* public function get_share_items_link(){
        $return_data = array(
            'data' => [],
            'message' => '',
            'code'=> 201,
        );
        $now_time = time();

        try{
            $yesterday_date_int = intval(date('Ymd' , ( $now_time -  ( 24 * 60 * 60 ) ) ) ); //20190205
            $today_date_int = intval(date('Ymd' , $now_time) ); //20190206

            $entity_param = input('param.');

            if(empty($entity_param['get_data_type'])){
                $entity_param['get_data_type'] = 'items';
                
            }else{
                if( $entity_param['get_data_type'] == 'company' || $entity_param['get_data_type'] == 'user'){

                    if(!empty($entity_param['_'])){ //需要传入token值
                        $userData = Token::getUserGreps(['key_name' => $entity_param['_']]);
                        //$userData['company_id']  $userData['user_id']
                    }else{
                        throw new \Exception('请添加token');
                    }

                }else if( $entity_param['get_data_type'] == 'items'){

                }else{
                    throw new \Exception('传入的get_data_type'. $entity_param['get_data_type'] . '  不对！');
                }
            }

            if($entity_param['get_data_type'] == 'items'){
                if(empty( $entity_param['items_dirname'] )){ //如果没有项目目录
                    throw new \Exception('请传入 items_dirname');
                }
                //641b3ad9547fbd821d764372e150c7ac
                $data = Db::table('items_share')->where('opreation_date','in',[$yesterday_date_int, $today_date_int])->where(['items_dirname' => $entity_param['items_dirname'] ])->select();
                
                //dump($data);
            }else if($entity_param['get_data_type'] == 'user'){ //查询user的访问
                $data = Db::table('items_share_user')->where('opreation_date','in',[$yesterday_date_int, $today_date_int])->where([ 'user_id' => $userData['user_id']])->select();
            }else if($entity_param['get_data_type'] == 'company'){//查询公司的访问
                $data = Db::table('items_share_company')->where('opreation_date','in',[$yesterday_date_int, $today_date_int])->where( [ 'company_id' => $userData['company_id']] )->select();
            }
            

            $today_sum = 0;
            $yesterday_sum = 0;
            foreach( $data as $kk => $vv){
                if($vv['opreation_date'] == $yesterday_date_int ){
                    $yesterday_sum  = $vv['sum']; //记录昨天的数据
                }
                if($vv['opreation_date'] == $today_date_int){
                    $today_sum  = $vv['sum']; //记录今天的数据
                }
            }
            
            //设置相对比率
            $all_relative_rate = 0;
            if($today_sum == 0){
                if($yesterday_sum != 0){
                    $all_relative_rate = -1 ; //下降了 100 %
                }
            }else{ //今天有访问

                if($yesterday_sum == 0){ 
                    $all_relative_rate = 1 ; // 上升了100%
                }else{ //两天都有数据
                    $all_relative_rate = ( $today_sum / $yesterday_sum ) -1;
                }

            }

            

        
            $all_relative_rate_status = 0; //增降状态
            
            if($all_relative_rate > 0){ //证明
                $all_relative_rate_status = 1;
                
            }else if($all_relative_rate < 0 ){
                $all_relative_rate_status = -1;
            }

            $all_relative_rate = round( ($all_relative_rate * 100) , 2 ) . '%';
           
            
            $get_data = [
                'sum' => $today_sum, //今天的数量
                'all_relative_rate' => $all_relative_rate, //增降比率
                'all_relative_rate_status' => $all_relative_rate_status, //增降状态
            ];
            
            
            
            $return_data = array(
                'data' =>$get_data,
                'message' => '获取链接分享数据!',
                'code'=> 200,
                
            );



       
            
           

        }catch(\Exception $e){
            $return_data = array(
                'data' => [],
                'message' => $e->getMessage(),
                'code'=> 401,
            );
        }

        //echo json_encode($return_data);exit;
        return   $return_data ;
    } */

    //获取项目拨打电话信息 ，
    public function get_items_click_number() {
        $return_data = array(
            'data' => [],
            'message' => '',
            'code'=> 201,
        );
        $now_time = time();
        try{
            $yesterday_date_int = intval(date('Ymd', ($now_time - ( 24 * 60 * 60 )))); //20190205
            $today_date_int = intval(date('Ymd', $now_time)); //20190206
            $entity_param = input('param.');
            if (empty($entity_param['get_data_type'])) {
                $entity_param['get_data_type'] = 'items';
            } else {
                if ($entity_param['get_data_type'] == 'company' || $entity_param['get_data_type'] == 'user') {
                    if (!empty($entity_param['_'])) { //需要传入token值
                        $userData = Token::getUserGreps(['key_name' => $entity_param['_']]);
                        //$userData['company_id']  $userData['user_id']
                    } else {
                        throw new \Exception('请添加token');
                    }
                } else if ($entity_param['get_data_type'] == 'items') {

                }else{
                    throw new \Exception('传入的get_data_type'. $entity_param['get_data_type'] . '  不对！');
                }
            }
            if ($entity_param['get_data_type'] == 'items') {
                if (empty( $entity_param['items_dirname'] )) { //如果没有项目目录
                    throw new \Exception('请传入 items_dirname');
                }
                //641b3ad9547fbd821d764372e150c7ac
                $data = Db::table('items_click_number')->where('opreation_date','in',[$yesterday_date_int, $today_date_int])->where(['items_dirname' => $entity_param['items_dirname']])->select();
            } else if ($entity_param['get_data_type'] == 'user') { //查询user的访问
                $data = Db::table('items_click_number_user')->where('opreation_date','in',[$yesterday_date_int, $today_date_int])->where(['user_id' => $userData['user_id']])->select();
            }else if ($entity_param['get_data_type'] == 'company') {//查询公司的访问
                $data = Db::table('items_click_number_company')->where('opreation_date','in',[$yesterday_date_int, $today_date_int])->where(['company_id' => $userData['company_id']] )->select();
            }
            $today_sum = 0;
            $yesterday_sum = 0;
            foreach ($data as $kk => $vv) {
                if ($vv['opreation_date'] == $yesterday_date_int ) {
                    $yesterday_sum  = $vv['sum']; //记录昨天的数据
                }
                if ($vv['opreation_date'] == $today_date_int) {
                    $today_sum  = $vv['sum']; //记录今天的数据
                }
            }
            //设置相对比率
            $all_relative_rate = 0;
            if ($today_sum == 0) {
                if ($yesterday_sum != 0) {
                    $all_relative_rate = -1 ; //下降了 100 %
                }
            } else { //今天有访问
                if ($yesterday_sum == 0) { 
                    $all_relative_rate = 1 ; // 上升了100%
                } else { //两天都有数据
                    $all_relative_rate = ($today_sum / $yesterday_sum) -1;
                }
            }
            $all_relative_rate_status = 0; //增降状态
            if ($all_relative_rate > 0) { //证明
                $all_relative_rate_status = 1;
            } else if ($all_relative_rate < 0) { 
                $all_relative_rate_status = -1;
            }
            $all_relative_rate = round(($all_relative_rate * 100), 2 ) . '%';
            $get_data = [
                'sum' => $today_sum, //今天的数量
                'all_relative_rate' => $all_relative_rate, //增降比率
                'all_relative_rate_status' => $all_relative_rate_status, //增降状态
            ];
            $return_data = array(
                'data' => $get_data,
                'message' => '获取拨打电话数据!',
                'code'=> 200,
            );
        } catch (\Exception $e) {
            $return_data = array(
                'data' => [],
                'message' => $e->getMessage(),
                'code'=> 401,
            );
        }
        //echo json_encode($return_data);exit;
        return   $return_data;
    }

    //获取项目链接分享信息(转发率) 分享数/访客
    public function get_share_items_link() {
        $return_data = array(
            'data' => [],
            'message' => '',
            'code'=> 201,
        );
        $now_time = time();
        try{
            $yesterday_date_int = intval(date('Ymd', ($now_time - ( 24 * 60 * 60)))); //20190205
            $today_date_int = intval(date('Ymd', $now_time)); //20190206
            $entity_param = input('param.');
            if (empty($entity_param['get_data_type'])) {
                $entity_param['get_data_type'] = 'items';
            } else {
                if ($entity_param['get_data_type'] == 'company' || $entity_param['get_data_type'] == 'user') {
                    if (!empty($entity_param['_'])) { //需要传入token值
                        $userData = Token::getUserGreps(['key_name' => $entity_param['_']]);
                        //$userData['company_id']  $userData['user_id']
                    } else {
                        throw new \Exception('请添加token');
                    }
                } else if ($entity_param['get_data_type'] == 'items') {

                } else {
                    throw new \Exception('传入的get_data_type'. $entity_param['get_data_type'] . '  不对！');
                }
            }
            if ($entity_param['get_data_type'] == 'items') {
                if (empty($entity_param['items_dirname'])) { //如果没有项目目录
                    throw new \Exception('请传入 items_dirname');
                }
                //641b3ad9547fbd821d764372e150c7ac
                $data = Db::table('items_share')->where('opreation_date','in',[$yesterday_date_int, $today_date_int])->where(['items_dirname' => $entity_param['items_dirname']])->select();
                //dump($data);
            } else if ($entity_param['get_data_type'] == 'user') { //查询user的访问
                $data = Db::table('items_share_user')->where('opreation_date','in',[$yesterday_date_int, $today_date_int])->where(['user_id' => $userData['user_id']])->select();
            } else if ($entity_param['get_data_type'] == 'company') {//查询公司的访问
                $data = Db::table('items_share_company')->where('opreation_date','in',[$yesterday_date_int, $today_date_int])->where(['company_id' => $userData['company_id']])->select();
            }
            $class_data = new \app\statisticstest\controller\Data();
            $get_nb_vistis_data  = $class_data->to_get_VisitsSummary_getVisits($entity_param);
            // yesterday_nb_visits 昨天访问量
            // nb_visits  今天访问量
            $nb_visits = 0 ;
            $yesterday_nb_visits = 0 ;
            if (!empty( $get_nb_vistis_data['data']['nb_visits'])) { //今天访问
                $nb_visits = $get_nb_vistis_data['data']['nb_visits'];
            } 
            if (!empty( $get_nb_vistis_data['data']['yesterday_nb_visits'])) { //昨天访问
                $yesterday_nb_visits = $get_nb_vistis_data['data']['yesterday_nb_visits'];
            } 
            $today_sum = 0;  //今天分享
            $yesterday_sum = 0;  //昨天分享
            foreach ($data as $kk => $vv) {
                if ($vv['opreation_date'] == $yesterday_date_int) {
                    $yesterday_sum  = $vv['sum']; //记录昨天的数据
                }
                if ($vv['opreation_date'] == $today_date_int) {
                    $today_sum  = $vv['sum']; //记录今天的数据
                }
            }
            //设置今天转发率
            $today_relative_rate = 0; // 今天的分享率
            if ($today_sum == 0) {
                if ($nb_visits != 0) {
                    $today_relative_rate = -1; //下降了 100 %
                }
            } else { //今天有分享
                if ($nb_visits == 0) { //其实没有该可能，有分享必有访客
                    $today_relative_rate = 1 ; // 上升了100%
                } else { // 都有数据
                    $today_relative_rate = ($today_sum / $nb_visits);
                }
            }
            //设置昨天
            $yesterday_relative_rate = 0; // 昨天的分享率
            if ($yesterday_sum == 0) {
                if ($yesterday_nb_visits != 0) {
                    $yesterday_relative_rate = -1 ; //下降了 100 %
                }
            } else { //有分享
                if ($yesterday_nb_visits == 0) { 
                    $yesterday_relative_rate = 1; // 上升了100%
                } else { // 都有数据
                    $yesterday_relative_rate = ($yesterday_sum / $yesterday_nb_visits);
                }
            }
            //设置相对比率
            $all_relative_rate = ($today_relative_rate - $yesterday_relative_rate) - 1; //增减比率，今天减去昨天
            $all_relative_rate_status = 0; //增降状态
            if ($all_relative_rate > 0) { //证明
                $all_relative_rate_status = 1;
            } else if ($all_relative_rate < 0 ) {
                $all_relative_rate_status = -1;
            }
            $all_relative_rate = round(($all_relative_rate * 100) , 2) . '%';
            $today_relative_rate = round(($today_relative_rate * 100) , 2) . '%';
            $get_data = [
                'sum' => $today_sum, //今天的数量
                //'yesterday_sum' => $yesterday_sum, //今天的数量
                //'yesterday_nb_visits' => $yesterday_nb_visits, //今天的数量
                // 'nb_visits' => $nb_visits, //今天的数量
                'all_relative_rate' => $all_relative_rate, //增降比率
                'today_relative_rate' => $today_relative_rate, //今天的转发率
                'all_relative_rate_status' => $all_relative_rate_status, //增降状态
            ];
            $return_data = array(
                'data' => $get_data,
                'message' => '获取链接分享数据!',
                'code'=> 200,
            );
        } catch (\Exception $e) {
            $return_data = array(
                'data' => [],
                'message' => $e->getMessage(),
                'code' => 401,
            );
        }
       // echo json_encode($return_data);exit;
        return   $return_data;
    }

}