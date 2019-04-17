<?php
namespace app\statisticstest\controller;

use app\index2\controller\Items;
use think\Db;
use app\common\Token;

class Data
{
    // 3a70f751785fc2667c4f99cc0b40f3bb 测试一个没有访问的数据

    //参考链接 https://developer.matomo.org/api-reference/reporting-api
    /**
        *   $url = "https://demo.matomo.org/";
        *   $url .= "?module=API&method=Referrers.getKeywords";
        *   $url .= "&idSite=7&period=month&date=yesterday";
        *   $url .= "&format=PHP&filter_limit=20";
        *   $url .= "&token_auth=$token_auth";
    */
    protected $token_auth = 'a7a642e9984dc44511838250291c156d'; //必须
    protected $format = 'PHP'; //返回类型 //必须
    protected $siteUrl = 'https://todo.kangyun3d.cn/statistics/matomo/index.php'; //接口地址  必须
    protected $module = 'API' ; //调用的模块   必须

    //?date=yestoday&items_dirname=641b3ad9547fbd821d764372e150c7ac&period=date&method=API.get
    // protected $idSite = ''; //网址id    必须
    // protected $items_dirname = ''; //网址目录名

    // protected $period = ''; //周期， 有month,year,week 等等 必须
    //  protected $date = ''; //哪日 等等 必须

    // protected $filter_offset  = 0; //数据库查询偏移量 ，默认第一条开始
    // protected $filter_limit = 100; //限制条数，默认100条， -1 是全部

    // protected $filter_sort_order   = ''; //asc.desc
    // protected $filter_sort_column  =  ''; // 定义要排序的列

    
    // protected $method = '' ; //实际调用的方法   必须

    // protected $commonUrl = '';
    
   //如果对接口的操作的返回不明确，登录到后台  index.php?module=API&action=listAllAPI&date=yesterday&period=day&idSite=9

    protected $method_array = [ //函数名 =》 为了防止接口等非正常调用
    
        //Module API
        'API.getPhpVersion' => 'API.getPhpVersion',  //获得php版本
        'API.getMatomoVersion' => 'API.getMatomoVersion', //获得Matomo版本
        'API.getIpFromHeader' => 'API.getIpFromHeader',   //获取当前的ip

        'API.getSettings' => 'API.getSettings',   //未知
        'API.getSegmentsMetadata' => 'API.getSegmentsMetadata',   //未知

        'API.getMetadata' => 'API.getMetadata',   //获取接口的操作方式
        'API.getReportMetadata' => 'API.getReportMetadata', //获取接口的操作方式的集合

        'API.getReportPagesMetadata' => 'API.getReportPagesMetadata',  //未知
        'API.getWidgetMetadata' => 'API.getWidgetMetadata',    //未知
        'API.get' => 'API.get',     //获取某天或者某段时间字段的值

        'API.getRowEvolution' => 'API.getRowEvolution', //未知
        
        'API.getGlossaryReports' => 'API.getGlossaryReports',//接口返回的字段说明
        'API.getGlossaryMetrics' => 'API.getGlossaryMetrics',//接口返回的字段说明（更详情）
        
        //Module Actions

        'Actions.get' => 'Actions.get',  //页面分析 - 主要指标
        'Actions.getPageUrls' => 'Actions.getPageUrls', //此报表显示被访问的网页地址信息。


        //Module DevicesDetection
        'DevicesDetection.getType' => 'DevicesDetection.getType',  //设备类型
        'DevicesDetection.getBrand' => 'DevicesDetection.getBrand', //设备品牌
        'DevicesDetection.getModel' => 'DevicesDetection.getModel', //设备型号

        'DevicesDetection.getOsFamilies' => 'DevicesDetection.getOsFamilies', //操作系统家族
        'DevicesDetection.getOsVersions' => 'DevicesDetection.getOsVersions', //操作系统版本

        'DevicesDetection.getBrowsers' => 'DevicesDetection.getBrowsers', //浏览器
        'DevicesDetection.getBrowserVersions' => 'DevicesDetection.getBrowserVersions', //浏览器版本
        'DevicesDetection.getBrowserEngines' => 'DevicesDetection.getBrowserEngines', //浏览器引擎
        
        //Module DevicePlugins
        'DevicePlugins.getPlugin' => 'DevicePlugins.getPlugin',//浏览器插件

        'Resolution.getResolution' => 'Resolution.getResolution', //获取设备分辨率
        'Resolution.getConfiguration' => 'Resolution.getConfiguration',

        //Module Live
        'Live.getLastVisitsDetails'=>'Live.getLastVisitsDetails', //某天所有的访问者的详细信息 ,不支持多天查看，只支持某天数据
        'Live.getVisitorProfile'=>'Live.getVisitorProfile', // 单个访问有关访问者的完整访问级别信息,（需要重写方法）该链接需要多加一个参数（访问id) visitorId,在Live.getLastVisitsDetails 中获得
        

        //Module MultiSites
        'MultiSites.getAll' => 'MultiSites.getAll', //所有网站报表 ,（需要重写方法），该接口是直接将idSite = all 来调用
        'MultiSites.getOne' => 'MultiSites.getOne',//单个网站报表

        // Module UserCountry
        'UserCountry.getCountry'=> 'UserCountry.getCountry', //国家
        'UserCountry.getContinent'=> 'UserCountry.getContinent', //大洲
        'UserCountry.getRegion'=> 'UserCountry.getRegion', //省
        'UserCountry.getCity'=> 'UserCountry.getCity',//城市
        
        //Module UserLanguage
        'UserLanguage.getLanguage'=>'UserLanguage.getLanguage',//浏览器语言


        //Module VisitFrequency
        'VisitFrequency.get'=>'VisitFrequency.get', //老访客的访问次数
        
        //Module VisitTime
        'VisitTime.getVisitInformationPerLocalTime'=>'VisitTime.getVisitInformationPerLocalTime',//日报表,小时区分 本地时间 0-1时，1-2时，。。。23-24时，等等
        'VisitTime.getVisitInformationPerServerTime'=>'VisitTime.getVisitInformationPerServerTime',//日报表,小时区分 服务器时间 0-1时，1-2时，。。。23-24时，等等

        //Module VisitorInterest
        'VisitorInterest.getNumberOfVisitsPerVisitDuration'=>'VisitorInterest.getNumberOfVisitsPerVisitDuration' , //访问停留时间段 0-15秒，15-30秒，30-60秒，1-2分钟，2-4分钟 等等
        'VisitorInterest.getNumberOfVisitsPerPage'=>'VisitorInterest.getNumberOfVisitsPerPage' , //每次访问浏览的页面数 1页多少访客，2页多少访客，3。。。等等
        'VisitorInterest.getNumberOfVisitsByDaysSinceLast'=>'VisitorInterest.getNumberOfVisitsByDaysSinceLast' , //本报表显示距离上次访问特定天数的访客量。
        'VisitorInterest.getNumberOfVisitsByVisitCount'=>'VisitorInterest.getNumberOfVisitsByVisitCount' , //本报表显示第N次访问的访客量。 每个访客一天的访问次数，一次访问多少个访客，2次访问多少个访客，。。。。等等 
        
        //Module VisitsSummary
        'VisitsSummary.get' => 'VisitsSummary.get', // 访客总表
        'VisitsSummary.getVisits'=>'VisitsSummary.getVisits',//访客
    ];


    public function index( ){ 
        //总数据接口，可以通过添加参数 method直接获取数据
        //https://todo.kangyun3d.cn/index.php/statistics/data/index?date=2019-01-28&items_dirname=641b3ad9547fbd821d764372e150c7ac&period=day&method=Live.getLastVisitsDetails
        $entity_param = input('param.');
        $return_data = $this->get_data($entity_param);
        
       echo json_encode($return_data, JSON_UNESCAPED_UNICODE);
       exit;
       
    }

     //接收并改变参数
    protected function getParam($entity){



        //$get_param = [];

        $items = new Items();


       

        if(empty($entity)){
            throw new \Exception('请添加参数!');
        }

        
        if(empty($entity['get_data_type'])){ //如果有该参数可能是user或者company的数据
            $entity['get_data_type'] = 'items';
        
        }else{
            if($entity['get_data_type']  == 'items' || $entity['get_data_type']  == 'user' ||  $entity['get_data_type']  == 'company'){
                
            }else{
                throw new \Exception('填写的 get_data_type "'.$entity['get_data_type']  .'"  有误');
            }
        }
        if(  $entity['get_data_type'] != 'items' ){
            if(!empty($entity['_'])){
                $userData = Token::getUserGreps(['key_name' => $entity['_']]);
                if($entity['get_data_type'] == 'company'){
                    $entity['items_dirname'] = 'company_'. $userData['company_id'];
                }else if($entity['get_data_type'] == 'user'){
                    $entity['items_dirname'] =  'user_' .$userData['user_id'];
                }
            }else{
                throw new \Exception('请添加token');
            }
        
        }
        

        if(empty($entity['items_dirname'])){  
            if(empty($entity['idSite'])){ //证明既没有定义idSite和items_dirname
                throw new \Exception('请添加项目目录 items_dirname!');
            }else{
                $entity['idSite']  =  $entity['idSite'] ;
            }
            
        }else{
            if($entity['items_dirname'] == 'all' || $entity['method'] == 'MultiSites.getAll'){ //如果 items_dirname = all ，就将 idSite = all ,将获取所有的数据
                $entity['idSite'] = 'all'; //'MultiSites.getAll', //所有网站报表,暂时只有该方法需要执行
            }else{
                $param_items = [];
                $param_items['items_dirname'] = $entity['items_dirname'] ;

                $get_site_data = $items->getSite($param_items);
                if($get_site_data['code'] != 200){
                    throw new \Exception($get_site_data['message']);
                }else{
                    if(!empty($get_site_data['data']['idsite'])){
                        //$this->idSite = $get_site_data['data']['idsite'];
                        $entity['idSite'] = $get_site_data['data']['idsite'];
                    }else{
                        throw new \Exception('get idsite null!');
                    }
                }

            }
            
        }


        

        if(empty($entity['method'])){ //方法 必选
            throw new \Exception('请添加查找的函数名 method!');
        }else{ 
            $entity['method'] = str_replace('_','.',$entity['method']); //将 '_' 改回  '.' ;
            if(empty( $this->method_array[$entity['method']] )){ //必须初始化，防止前端乱调用方法
                throw new \Exception('请添加一个有效的函数名 method!');
            }

            //$this->method = $entity['method'];

        }

        if(empty($entity['period'])){
            $entity['period'] = 'day';
            //throw new \Exception('请添加一个有效 period !');
        }else{
          // $this->period = $entity['period'];
        }

        if(empty($entity['date'])){
            $entity['date'] = 'yesterday';
            //throw new \Exception('请添加一个有效 date !');
        }else{
           // $this->date = $entity['date'];
        }

        if(empty($entity['filter_limit'])){ //查找条数
            // $this->filter_limit = $entity['filter_limit'];
            $entity['filter_limit'] = 50;
        }

        if(empty($entity['filter_page'])){ //查找的页数，自定义，piwik中没有
            $entity['filter_page'] = 1;//第一页
        }
        $entity['filter_offset'] = ($entity['filter_page'] -1) * $entity['filter_limit'];
        
       
 


        
        return $entity;


    }


    protected function getUrl($param){

        $urlLink = '';

        $urlLink .= $this->siteUrl; // 第一步
        $urlLink .= '?module=' .     $this->module ;
        $urlLink .= '&method=' .     $param['method']; //方法
        $urlLink .= '&format=' .     $this->format ;
        $urlLink .= '&token_auth=' . $this->token_auth;
        $urlLink .= '&idSite=' .     $param['idSite'];
        $urlLink .= '&period=' .     $param['period'];
        $urlLink .= '&date=' .     $param['date'];

        if(!empty($entity['filter_offset'])){ //偏移量
            $urlLink .= '&filter_offset=' . $entity['filter_offset'];
        }
        if(!empty($entity['filter_limit'])){ //查找条数
            $urlLink .= '&filter_limit=' . $entity['filter_limit'];
        }
        if(!empty($entity['filter_sort_order'])){ //排序方法 asc desc
            $urlLink .= '&filter_sort_order=' . $entity['filter_sort_order'];
        }
        if(!empty($entity['filter_sort_column'])){ //排序的列 
            $urlLink .= '&filter_sort_column=' . $entity['filter_sort_column'];
        }

        /* if( $param['method'] == 'Live.getVisitorProfile'){ //特别方法
            $urlLink .= '&' ;
        } */

        return  $urlLink;




    }

    public function get_data($entity_param){
        $return_data = array(
            'data' => [],
            'message' => '',
            'code'=> 201,
        );

       

        try{

            //$entity_param = input('param.');

            $param = $this->getParam($entity_param);

            $get_url = $this->getUrl($param);

            $data_temp = file_get_contents( $get_url);
            $data = unserialize($data_temp);
            unset($data_temp);
            if (!$data) {
                //throw new \Exception("get php array is empty " );
                $return_data = array(
                    'data' => $data,
                    'message' => 'get success and is empty!',
                    'code'=> 200,
                    'idsite'=> $param['idSite'],

                );
            }else{
                if(!empty($data['result']) && $data['result'] == 'error'){
                    throw new \Exception($data['message'] );
                }else{
                    $return_data = array(
                        'data' => $data,
                        'message' => 'get success!',
                        'code'=> 200,
                        'idsite'=> $param['idSite'],

                    );
                }
            }


           



       }catch(\Exception $e){
            $return_data = array(
                'data' => [],
                'message' => $e->getMessage(),
                'code'=> 401,
            );
       }

       return $return_data;
       
    }
 

    public function __construct(){
       

        
    }









        /**
         * 详细方法
         */
        
        //https://todo.kangyun3d.cn/index.php/statistics/data/index?date=2019-01-28&items_dirname=641b3ad9547fbd821d764372e150c7ac&period=day&method=Live.getLastVisitsDetails
        //https://todo.kangyun3d.cn/index.php/statistics/data/API_get?date=2019-01-28&items_dirname=641b3ad9547fbd821d764372e150c7ac&period=day


    


    //单独重写 //获取某个访问的详情（暂时没有用到，先注释）
    /* public function Live_getVisitorProfile()
    {
        

        //visitorId=84af91e1f64523ab

        $return_data = array(
            'data' => [],
            'message' => '',
            'code'=> 201,
        );

       

        try{

            $entity_param = input('param.');
            $entity_param['method'] = __FUNCTION__; //当前的方法
        
            if(empty($entity_param['visitorId'])){
                throw new \Exception('请添加 visitorId ');
            }

            $param = $this->getParam($entity_param);

            $get_url = $this->getUrl($param);
            $get_url .= '&visitorId='.$entity_param['visitorId'];
            $get_url = str_replace('format='.$this->format , 'format=json' , $get_url);  // 将  format=php  改为 format=json

            $data_temp = file_get_contents( $get_url);
            
            $data = json_decode($data_temp,true);
            
            
            if(!$data){
                throw new \Exception('获取数据出错！ ');
            
            }else{
                $return_data = array(
                                'data' => $data,
                                'message' => 'get success!',
                                'code'=> 200,
                                'idsite'=> $param['idSite'],
                            );
            }
                
            
            

        }catch(\Exception $e){
            $return_data = array(
                'data' => [],
                'message' => $e->getMessage(),
                'code'=> 401,
            );
        }



        echo json_encode($return_data, JSON_UNESCAPED_UNICODE);
        exit;

    } */

    
    //获取总访客信息,比较昨天和今天
    public function all_VisitsSummary_get(){ //已经测试 03-28
        //设置默认天数
        $now_time = time();
        $today_time = date("Y-m-d",$now_time);
        $yesterday_time = date("Y-m-d",($now_time - 60*60*24)); //昨天
        

        $return_data = array(
            'data' => [],
            'message' => '',
            'code'=> 201,
        );

        try{

            $entity_param = input('param.');

            //可能是整个用户的数据，也可能是某个项目的数据
            /* if($entity_param){

            } */

           // token de39ad28babe2c12e9f10855425f8ebe
           //$entity_param['_'] = 'de39ad28babe2c12e9f10855425f8ebe';
          // $entity_param['get_data_type'] = 'company';

            //$entity_param['items_dirname'] = 'user_1';
            if(empty($entity_param['date'])){
                $entity_param['date'] = $yesterday_time . ',' . $today_time;
                //$entity_param['date'] =  '2012-02-10' ;
            }
            //$entity_param['method'] = __FUNCTION__; //当前的方法
            $entity_param['method'] = 'VisitsSummary.get'; //当前的方法
            $getData_message = $this->get_data($entity_param);


           
            if($getData_message['code'] == 200){
               /*  $set_data = [
                    'nb_uniq_visitors' =>0, //独立访客
                    'nb_visits' =>0, //访问量
                    'nb_actions' =>0,//pv
                    'nb_uniq_visitors_rate' =>0, //比较前天
                    'nb_visits_rate' => 0,//比较前天
                    'nb_actions_rate' => 0,//比较前天
                ]; */
                $set_prevent_data = [];
                $set_prevent_data = [
                    'nb_uniq_visitors' =>0, //独立访客
                    'nb_visits' =>0, //访问量
                    'nb_actions' =>0,//pv
                ];
                $set_prevent_data_rate = [];
                $set_prevent_data_rate = [
                    'nb_uniq_visitors' =>1, //比较前天
                    'nb_visits' => 1,//比较前天
                    'nb_actions' => 1,//比较前天
                ];

                $set_prevent_data_status = []; //当天的是否增加,0是不变化，-1是下降，1是增加
                $set_prevent_data_status = [
                    'nb_uniq_visitors' =>0, //比较前天
                    'nb_visits' => 0,//比较前天
                    'nb_actions' => 0,//比较前天
                ];

               

                if( empty($getData_message['data'][$today_time])  ){ //今天没有数据
                    if( empty($getData_message['data'][$yesterday_time])){ //今天和前天都没有数据

                    }else{
                        foreach(  $set_prevent_data as $kk => $vv){
                            if($getData_message['data'][$yesterday_time][$kk] != 0){ //昨天有数据，今天没数据
                                $set_prevent_data_rate[$kk] =  0 ;
                                
                            }else{ //不增

                            }
                        }
                    }
                }else{ //今天有数据
                    $set_prevent_data = [
                        'nb_uniq_visitors' =>$getData_message['data'][$today_time]['nb_uniq_visitors'], //独立访客
                        'nb_visits' =>$getData_message['data'][$today_time]['nb_visits'], //访问量
                        'nb_actions' =>$getData_message['data'][$today_time]['nb_actions'],//pv
                    ];
                   

                    if( empty($getData_message['data'][$yesterday_time])){ //今天有数据，前天都没有数据
                        foreach(  $set_prevent_data as $kk => $vv){
                            if ($set_prevent_data[$kk] != 0){
                                 $set_prevent_data_rate[$kk] = 2;//不能设置为 1 ，如果两天数据一样的话 才是 1 ，
                            }else{ //就是默认值 1

                            }
                            
                        }              
                    }else{//今天有数据，前天都有数据
                        foreach(  $set_prevent_data as $kk => $vv){ 
                            if($getData_message['data'][$yesterday_time][$kk] == 0){
                                if( $set_prevent_data[$kk] != 0){
                                    $set_prevent_data_rate[$kk] = 2;//不能设置为 1 ，如果两天数据一样的话 才是 1 ，
                                }
                            }else{
                                $set_prevent_data_rate[$kk] =$getData_message['data'][$today_time][$kk] / $getData_message['data'][$yesterday_time][$kk];
                            }
                        }
                        
                    }
                }

                //将数据比率 减去 1

                foreach(  $set_prevent_data_rate as $kk => $vv){ 
                    $set_prevent_data_rate[$kk] -= 1; 
                    
                    if( $set_prevent_data_rate[$kk]<0){
                        $set_prevent_data_status[$kk]  = -1;
                    }else if($set_prevent_data_rate[$kk] > 0){
                        $set_prevent_data_status[$kk]  =  1;
                    }

                    $set_prevent_data_rate[$kk] = round( ($set_prevent_data_rate[$kk] * 100) , 2 ) . '%';
                }

               // $get_return_data = array_merge( $set_prevent_data ,$set_prevent_data_rate);
                $return_data = array(
                    'data' =>[
                        'set_prevent_data' =>$set_prevent_data,
                        'set_prevent_data_rate' =>$set_prevent_data_rate,
                        'set_prevent_data_status' =>$set_prevent_data_status,
                    ] ,
                    'message' =>'get success',
                    'code'=> 200,
                    'idsite'=>  $getData_message['idsite'],
                );
               // dump($getData_message );
              
            }else{
                throw new \Exception($getData_message['message']);
            }
           

        }catch(\Exception $e){
            $return_data = array(
                'data' => [],
                'message' => $e->getMessage(),
                'code'=> 401,
            );
        }

        
        return $return_data;
       

    }



    //获取总访客信息，历史访客
    public function history_VisitsSummary_getVisits(){ //已经测试 03-28
        //设置默认天数
        $now_time = time();
        $today_time = date("Y-m-d",$now_time);
       // $yesterday_time = date("Y-m-d",($now_time - 60*60*24)); //昨天
        
        

        $return_data = array(
            'data' => [],
            'message' => '',
            'code'=> 201,
        );

        try{

            $entity_param = input('param.');

            //可能是整个用户的数据，也可能是某个项目的数据
            /* if($entity_param){

            } */

           // token de39ad28babe2c12e9f10855425f8ebe
           //$entity_param['_'] = 'de39ad28babe2c12e9f10855425f8ebe';
           //$entity_param['get_data_type'] = 'company';

            //$entity_param['items_dirname'] = 'user_1';
            if(empty($entity_param['date'])){
                $entity_param['date'] = '2018-01-01,' . $today_time;
                //$entity_param['date'] =  '2012-02-10' ;
            }
            if(empty($entity_param['period'])){ //查询周期，永远 叠加
                $entity_param['period'] = 'range';
                
            }
            
            //$entity_param['method'] = __FUNCTION__; //当前的方法
            $entity_param['method'] = 'VisitsSummary.getVisits'; //当前的方法
            $getData_message = $this->get_data($entity_param);

            if($getData_message['code'] == 200){
                $return_data = array(
                                'data' =>[
                                    'nb_visits'=>$getData_message['data'],//总访客量
                                ], 
                                'message' => 'get getVisits success',
                                'code'=> 200,
                                'idsite'=>$getData_message['idsite']
                            );
            }else{
                throw new \Exception($getData_message['message']);

            }
           
            
           

        }catch(\Exception $e){
            $return_data = array(
                'data' => [],
                'message' => $e->getMessage(),
                'code'=> 401,
            );
        }

        
        return $return_data ;
        

    }

    
    ////获取活跃用户 ，当 停留时间段 >= 2分钟 ， 每次访问浏览的页面数 >= 5页， 给个用户的一天访问次数 >= 2 次 访问(已经废弃，改为下面的统计)
    public function active_users_VisitorInterest_other(   ){
        //设置默认天数
        $now_time = time();
        $today_time = date("Y-m-d",$now_time);
        $yesterday_time = date("Y-m-d",($now_time - 60*60*24)); //昨天
        
        // $yesterday_time = '2019-02-16';
        // $today_time = '2019-02-17';

        $return_data = array(
            'data' => [],
            'message' => '',
            'code'=> 201,
        );

        try{

            $entity_param = input('param.');

            //可能是整个用户的数据，也可能是某个项目的数据
            /* if($entity_param){

            } */

           // token de39ad28babe2c12e9f10855425f8ebe
           //$entity_param['_'] = 'de39ad28babe2c12e9f10855425f8ebe';
          // $entity_param['get_data_type'] = 'company';

            
            if(empty($entity_param['date'])){
                $entity_param['date'] = $yesterday_time . ',' . $today_time;
                
            }
            //$entity_param['method'] = __FUNCTION__; //当前的方法

            $param_array_method_dsfsd = [
                'VisitorInterest.getNumberOfVisitsByVisitCount', //每个独立访客一天的访问次数
                'VisitorInterest.getNumberOfVisitsPerPage',    //
                'VisitorInterest.getNumberOfVisitsPerVisitDuration',
            ];
            //Module VisitorInterest
            //'VisitorInterest.getNumberOfVisitsPerVisitDuration'=>'VisitorInterest.getNumberOfVisitsPerVisitDuration' , //访问停留时间段 0-15秒，15-30秒，30-60秒，1-2分钟，2-4分钟 等等
            //'VisitorInterest.getNumberOfVisitsPerPage'=>'VisitorInterest.getNumberOfVisitsPerPage' , //每次访问浏览的页面数 1页多少访客，2页多少访客，3。。。等等
            //'VisitorInterest.getNumberOfVisitsByDaysSinceLast'=>'VisitorInterest.getNumberOfVisitsByDaysSinceLast' , //本报表显示距离上次访问特定天数的访客量。
            //'VisitorInterest.getNumberOfVisitsByVisitCount'=>'VisitorInterest.getNumberOfVisitsByVisitCount' , //本报表显示第N次访问的访客量。 每个访客一天的访问次数，一次访问多少个访客，2次访问多少个访客，。。。。等等 

            //获取访问停留时间段

            $getData_message_array = [];
            $temp_all_relative_rate = 0; //定义总平均比率 先累计多个相加
            $temp_all_today_rate = 0 ; //定义当天的比率
            foreach($param_array_method_dsfsd as $vvv){
                $entity_param['method'] = $vvv; 
                $getData_message = $this->get_data($entity_param);

                if($getData_message['code'] != 200){
                    throw new \Exception($getData_message['message']);
                }
                
                //昨天
                $temp_yesterday_data_all_sum = 0; //总访问量
                $temp_yesterday_data_sum = 0; //定义活跃的量,
                $temp_yesterday_data_rate= 0;
                if( !empty( $getData_message['data'][$yesterday_time])){ //昨天不为空
                    foreach($getData_message['data'][$yesterday_time] as $kkk=>$v_vb_v){ //统计访客量
                        $temp_yesterday_data_all_sum += intval( $v_vb_v['nb_visits'] ) ;//总访问量
                        if($kkk >= 4 ){ //当 停留时间段 >= 2分钟 ， 每次访问浏览的页面数 >= 5页，
                            $temp_yesterday_data_sum += intval( $v_vb_v['nb_visits'] ) ;
                        }else{
                            if( $entity_param['method'] == 'VisitorInterest.getNumberOfVisitsByVisitCount'){
                                if($kkk >= 2 ){//每个独立访客一天的访问次数
                                    $temp_yesterday_data_sum += intval( $v_vb_v['nb_visits'] ) ;
                                }
                            }
                        }
                    }

                    if($temp_yesterday_data_all_sum != 0){
                        $temp_yesterday_data_rate =  $temp_yesterday_data_sum /  $temp_yesterday_data_all_sum ;
                    }

                }


                //今天
                $temp_today_data_all_sum = 0; //总访问量
                $temp_today_data_sum = 0; //定义活跃的量
                $temp_today_data_rate= 0;

                if( !empty( $getData_message['data'][$today_time])){ //今天不为空
                    foreach($getData_message['data'][$today_time] as $kkk=>$v_vb_v){ //统计访客量
                        $temp_today_data_all_sum += intval( $v_vb_v['nb_visits'] ) ;//总访问量
                        if($kkk >= 4){ //当 停留时间段 >= 2分钟 ， 每次访问浏览的页面数 >= 5页，
                            $temp_today_data_sum += intval( $v_vb_v['nb_visits'] ) ;
                        }else{
                            if( $entity_param['method'] == 'VisitorInterest.getNumberOfVisitsByVisitCount'){
                                if($kkk >= 2 ){//每个独立访客一天的访问次数
                                    $temp_today_data_sum += intval( $v_vb_v['nb_visits'] ) ;
                                }
                            }
                        }
                    }

                    if($temp_today_data_all_sum != 0){
                        $temp_today_data_rate =  $temp_today_data_sum /  $temp_today_data_all_sum ;
                    }
                }

                $temp_all_today_rate += $temp_today_data_rate ;//当天比率累加
                //把今天的比率减去昨天的比率
                $temp_relative_rate =  $temp_today_data_rate -  $temp_yesterday_data_rate ;
                
                $temp_all_relative_rate  += $temp_relative_rate; //比率差累计相加

                //查看某些数据时可以开启下面的注释
               /*  $getData_message['temp_today_data_rate'] = $temp_today_data_rate ;
                $getData_message['temp_yesterday_data_rate'] = $temp_yesterday_data_rate ;
                $getData_message['temp_relative_rate'] = $temp_relative_rate ;

                $getData_message['temp_today_data_all_sum'] = $temp_today_data_all_sum ;
                $getData_message['temp_today_data_sum'] = $temp_today_data_sum ;

                $getData_message['temp_yesterday_data_sum'] = $temp_yesterday_data_sum ;
                $getData_message['temp_yesterday_data_all_sum'] = $temp_yesterday_data_all_sum ;
                */
                $getData_message_array[$vvv] = $getData_message; 
            }
            //$getData_message_array 该变量里面有很多可用数据

            $all_relative_rate  = $temp_all_relative_rate / (count($param_array_method_dsfsd)) ; //比率差
            $all_today_rate  = $temp_all_today_rate / (count($param_array_method_dsfsd)) ; //当天比率
            $all_relative_rate_status = 0;
            
            if($all_relative_rate > 0){ //证明
                $all_relative_rate_status = 1;
                
            }else if($all_relative_rate < 0 ){
                $all_relative_rate_status = -1;
            }

            $all_relative_rate = round( ($all_relative_rate * 100) , 2 ) . '%';
            $all_today_rate = round( ($all_today_rate * 100) , 2 ) . '%';

            $return_data = array(
                'data' => [
                    'all_relative_rate'=>$all_relative_rate,
                    'all_today_rate'=>  $all_today_rate,
                    'all_relative_rate_status'=>  $all_relative_rate_status,
                   
                ],
                'message' => 'is success',
                'code'=> 200,
                //'other'=> $getData_message_array,
                
            );
            
           

        }catch(\Exception $e){
            $return_data = array(
                'data' => [],
                'message' => $e->getMessage(),
                'code'=> 401,
            );
        }

        return $return_data ;
         
    }

    //获取活跃用户 ， 用户的一天访问次数 >= 2 次 访问
    public function active_users_VisitorInterest(   ){ //已测试 03-28
        //设置默认天数
        $now_time = time();
        $today_time = date("Y-m-d",$now_time);
        $yesterday_time = date("Y-m-d",($now_time - 60*60*24)); //昨天
        
        // $yesterday_time = '2019-02-16';
        // $today_time = '2019-02-17';

        $return_data = array(
            'data' => [],
            'message' => '',
            'code'=> 201,
        );

        try{

            $entity_param = input('param.');

            //可能是整个用户的数据，也可能是某个项目的数据
            /* if($entity_param){

            } */

           // token de39ad28babe2c12e9f10855425f8ebe
           //$entity_param['_'] = 'de39ad28babe2c12e9f10855425f8ebe';
          // $entity_param['get_data_type'] = 'company';

            
            if(empty($entity_param['date'])){
                $entity_param['date'] = $yesterday_time . ',' . $today_time;
                
            }
           


            $entity_param['method'] = 'VisitorInterest.getNumberOfVisitsByVisitCount'; //每个独立访客一天的访问次数
            $getData_message = $this->get_data($entity_param);
            if($getData_message['code'] != 200){
                throw new \Exception($getData_message['message']);
            }

            
            //昨天数据
            $temp_yesterday_data_all_sum = 0; //昨天所有的访问量
            $temp_yesterday_data_sum = 0; //定义活跃的量,

            $temp_yesterday_data_rate = 0; //活跃比率

            if( !empty( $getData_message['data'][$yesterday_time])){ //昨天不为空
                foreach($getData_message['data'][$yesterday_time] as $kkk=>$v_vb_v){ //统计访客量
                    $temp_yesterday_data_all_sum += intval( $v_vb_v['nb_visits'] ) ;//总访问量
                        if($kkk >= 1 ){//每个独立访客一天的访问次数
                            $temp_yesterday_data_sum += intval( $v_vb_v['nb_visits'] ) ;
                        
                    
                        }                               
                }

                if($temp_yesterday_data_all_sum != 0){
                    $temp_yesterday_data_rate =  $temp_yesterday_data_sum /  $temp_yesterday_data_all_sum ; //计算出昨天的比率
                }
            }

            //今天数据
            //今天
            $temp_today_data_all_sum = 0; //总访问量
            $temp_today_data_sum = 0; //定义活跃的量
            $temp_today_data_rate = 0;

            if( !empty( $getData_message['data'][$today_time])){ //今天不为空
                foreach($getData_message['data'][$today_time] as $kkk=>$v_vb_v){ //统计访客量
                    $temp_today_data_all_sum += intval( $v_vb_v['nb_visits'] ) ;//总访问量
                    if($kkk >= 1 ){//每个独立访客一天的访问次数
                                $temp_today_data_sum += intval( $v_vb_v['nb_visits'] ) ;
                            
                        
                    }
                }

                if($temp_today_data_all_sum != 0){
                    $temp_today_data_rate =  $temp_today_data_sum /  $temp_today_data_all_sum ;
                }
            }


            //计算相对的增减比率(今天和昨天)
            $all_relative_rate = $temp_today_data_rate -  $temp_yesterday_data_rate ;
           

          
            $all_relative_rate_status = 0; //两天比较后的增减状态
            
            if($all_relative_rate > 0){ //证明
                $all_relative_rate_status = 1;
                
            }else if($all_relative_rate < 0 ){
                $all_relative_rate_status = -1;
            }

            $all_relative_rate = round( ($all_relative_rate * 100) , 2 ) . '%';
            $temp_today_data_rate = round( ($temp_today_data_rate * 100) , 2 ) . '%';

            $return_data = array(
                'data' => [
                    'all_relative_rate'=>$all_relative_rate, //今天和昨天对比的相对比率
                    'all_today_rate'=>  $temp_today_data_rate, //增降比率
                    'all_relative_rate_status'=>  $all_relative_rate_status, //增减状态
                    'today_data_sum'=>  $temp_today_data_sum, //活跃用户量

                    /* 'temp_yesterday_data_all_sum' =>$temp_yesterday_data_all_sum,
                    'temp_yesterday_data_sum' =>$temp_yesterday_data_sum,
                    'temp_yesterday_data_rate' =>$temp_yesterday_data_rate,

                    'temp_today_data_rate' =>$temp_today_data_rate,
                    'temp_today_data_all_sum' =>$temp_today_data_all_sum,
                    'temp_today_data_sum' =>$temp_today_data_sum, */
                   
                ],
                'message' => 'is success',
                'code'=> 200,
                
                
            );
            
           

        }catch(\Exception $e){
            $return_data = array(
                'data' => [],
                'message' => $e->getMessage(),
                'code'=> 401,
            );
        }

     
        return $return_data ;
        //echo json_encode($return_data);exit;
    }
   

    
    
    //获取访客信息, 当前周的每日访客量
    public function one_day_week_VisitsSummary_getVisits(){ //已测试 03-28
       
        
        

        $return_data = array(
            'data' => [],
            'message' => '',
            'code'=> 201,
        );

        try{

            $entity_param = input('param.');


           // token 0f2df62558c019b5dd5b93ef46fec858
          // $entity_param['_'] = '0f2df62558c019b5dd5b93ef46fec858';
           /*
                ["now_time"] => int(1550284613)
                ["monday_time"] => int(1549852613)
                ["sunday_time"] => int(1550371013)
                ["now_time_date"] => string(10) "2019-02-16"
                ["monday_time_date"] => string(10) "2019-02-11"
                ["sunday_time_date"] => string(10) "2019-02-17"
                ["week_day"] => int(6)
                } 

            */
            $now_time = time();
            $get_week_date_message =  com_this_week_time($now_time );

            //$entity_param['items_dirname'] = 'user_1';
           // if(empty($entity_param['date'])){
                $entity_param['date'] = $get_week_date_message['monday_time_date'] . ',' . $get_week_date_message['sunday_time_date'];
               
           // }


            //$entity_param['method'] = __FUNCTION__; //当前的方法
            $entity_param['method'] = 'VisitsSummary.getVisits'; //当前的方法
            $getData_message = $this->get_data($entity_param);
            
            if($getData_message['code'] == 200){
                $return_data = array(
                    'data' =>[
                        'one_week_data' =>$getData_message['data'],
                        'week_day' =>$get_week_date_message['week_day'], //本周几
                        'now_time_date' =>$get_week_date_message['now_time_date'], //今天日期
                    ] ,
                    'message' => '获取本周访客!',
                    'code'=> 200,
                    //'idSite' =>$getData_message['idsite'], 
                );

            }else{
                throw new \Exception($getData_message['message']);
            }


         //  dump( $getData_message);exit;
            
           

        }catch(\Exception $e){
            $return_data = array(
                'data' => [],
                'message' => $e->getMessage(),
                'code'=> 401,
            );
        }

        //echo json_encode($return_data);
        return   $return_data ;
        

    }


    
    //获取区域分布 城市  UserCountry.getCity（已经废弃了该方法，有 Location类 中定义了一个功能一样的获取城市的函数）
    /*  
    public function areal_UserCountry_getCity(){
        //设置默认天数
        $now_time = time();
        $today_time = date("Y-m-d",$now_time);
        $yesterday_time = date("Y-m-d",($now_time - 60*60*24)); //昨天
        

        $return_data = array(
            'data' => [],
            'message' => '',
            'code'=> 201,
        );

        try{

            $entity_param = input('param.');

            

           // token 0f2df62558c019b5dd5b93ef46fec858
          // $entity_param['_'] = '0f2df62558c019b5dd5b93ef46fec858';
         

            
            if(empty($entity_param['date'])){
                $entity_param['date'] =  $today_time;
               
            }
            //$entity_param['method'] = __FUNCTION__; //当前的方法
            $entity_param['method'] = 'UserCountry.getCity'; //当前的方法
            $getData_message = $this->get_data($entity_param);


            if($getData_message['code'] == 200){
                $return_getData_message = [];
                foreach ($getData_message['data'] as $v ){ //筛选输出
                    $temp = [];
                    $temp['city_name'] = $v['city_name'];
                    $temp['region_name'] = $v['region_name'];
                    $temp['country_name'] = $v['country_name'];
                    $temp['nb_visits'] = $v['nb_visits'];
                    
                    $return_getData_message[] = $temp;
                }
                    $return_data = array(
                        'data' =>$return_getData_message, 
                        'message' => '获取区域分布',
                        'code'=> 200,
                        //'idsite'=> $getData_message['idsite'],
                    );
            }else{
                throw new \Exception($getData_message['message']);
            }
            
           

        }catch(\Exception $e){
            $return_data = array(
                'data' => [],
                'message' => $e->getMessage(),
                'code'=> 401,
            );
        }

        
        echo json_encode($return_data, JSON_UNESCAPED_UNICODE);
        exit;

    } 
    */




     //获取某个项目访问量
     public function get_VisitsSummary_getVisits(  ){ //已测试 03-28
        $entity_param = input('param.');
        $return_data = $this->to_get_VisitsSummary_getVisits($entity_param);

        return   $return_data ;
        

    }


    //获取项目的访问量（该方法在 index2/items.php 中也被调用了）
    public function to_get_VisitsSummary_getVisits( $entity_param ){ 
         //设置默认天数
         $now_time = time();
         $today_time = date("Y-m-d",$now_time);
         $yesterday_time = date("Y-m-d",($now_time - 60*60*24)); //昨天
         
 
         $return_data = array(
             'data' => [],
             'message' => '',
             'code'=> 201,
         );
 
         try{
 
            
 
             
 
             
           
             //$entity_param['_'] = '5d44b0f9529322dbdb72289bef206447';
           
             if(empty($entity_param['date'])){
                 $entity_param['date'] = $yesterday_time . ',' . $today_time;
                
             }
             //$entity_param['method'] = __FUNCTION__; //当前的方法
             $entity_param['method'] = 'VisitsSummary.getVisits'; //当前的方法
             $getData_message = $this->get_data($entity_param);
 
             
             if($getData_message['code'] == 200){
 
 
                 $temp_yesterday_data_count = 0;
                 if(!empty(  $getData_message['data'][$yesterday_time]  )){
                     $temp_yesterday_data_count =  $getData_message['data'][$yesterday_time];
                 }
 
                 $temp_today_data_count = 0;
                 if(!empty($getData_message['data'][$today_time])){
                     $temp_today_data_count =  $getData_message['data'][$today_time];
                 }
                
                 
                 $temp_relative_rate = 1;
 
                 if($temp_yesterday_data_count == 0){
                     if( $temp_today_data_count != 0){
                         $temp_relative_rate = 2;
 
                     }
                 }else{
                     if( $temp_today_data_count == 0){
                         $temp_relative_rate = 0;
                         
                     }else { // 今天和昨天都有数据
                         $temp_relative_rate =  $temp_today_data_count / $temp_yesterday_data_count ;
                     }
                 }
 
                 //相对比率
                 $visit_relative_rate = $temp_relative_rate - 1 ; 
                 $visit_data_status = 0;//默认数据状态为 0，不增不降
                 if($visit_relative_rate > 0){
                     $visit_data_status  = 1;
                 }else if($visit_relative_rate < 0){
                     $visit_data_status = -1;
                 }
 
                 $visit_relative_rate = round( ($visit_relative_rate * 100) , 2 ) . '%';
 
                 $return_data = array(
                     'data' => [
                         'nb_visits' => $temp_today_data_count ,
                         'visit_data_status' => $visit_data_status,
                         'nb_visit_relative_rate' =>$visit_relative_rate, 
                         'yesterday_nb_visits' =>$temp_yesterday_data_count,
                     ],
                     'message' => 'get visit num success!',
                     'code'=> 200,
                     //'idsite'=>$getData_message['idsite'],
                 );
             }else{
                 throw new \Exception($getData_message['message']);
             }
             
            
 
         }catch(\Exception $e){
             $return_data = array(
                 'data' => [],
                 'message' => $e->getMessage(),
                 'code'=> 401,
             );
         }

         return  $return_data;
 
    }

    
    //获取最新的总发布的项目数
    /** 
     * $entity['get_data_type'] = company,user,items
    */
    public function items_send_sum(){
       
        

        $return_data = array(
            'data' => [],
            'message' => '',
            'code'=> 201,
        );

        try{
            $entity = input('param.');


            if(empty($entity['get_data_type'])){ //如果有该参数可能是user或者company的数据,或者items
                throw new \Exception('请添加 get_data_type');
            
            }else{
                if(  $entity['get_data_type']  == 'user' ||  $entity['get_data_type']  == 'company'){
                    
                }else{
                    throw new \Exception('填写的 get_data_type "'.$entity['get_data_type']  .'"  有误');
                }
            }

           
            //$entity['_'] = '5d44b0f9529322dbdb72289bef206447';

           
            if(!empty($entity['_'])){
                $userData = Token::getUserGreps(['key_name' => $entity['_']]);
                if($entity['get_data_type'] == 'company'){
                    $param_get_sum['where']['company_id'] =  $userData['company_id'];
                }else if($entity['get_data_type'] == 'user'){
                    $param_get_sum['where']['user_id'] =  $userData['user_id'];
                }
            }else{
                throw new \Exception('请添加token');
            }
            
            
            $get_data = [];
            $get_data = Db::table('items')->where('valid',1)->where($param_get_sum['where'] )->count();//->($param_get_time);

            

            
            
            $items_count = 0 ;
            if(!empty($get_data)){
                $items_count = $get_data ;
            }
            $return_data = array(
                    'data' => [
                        'items_count' => $items_count ,
                    ],
                    'message' =>   'get items_count success!',
                    'code'=> 200,
            );

            
           
        }catch(\Exception $e){
            $return_data = array(
                'data' => [],
                'message' => $e->getMessage(),
                'code'=> 401,
            );
        }

        
        return  $return_data ;
         
    }


}