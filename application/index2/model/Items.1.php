<?php
namespace app\index2\model;
use think\Model;
use think\Db;

class Items extends Model{

    //主要调用的方法是
    /**
     * 
     * 
        1.index2/items/get_dir_tree()     主要是获取所有自己能管理的目录，用树杈的方式显示出来
        2.index2/items/get_dir_list()     主要是获取所有自己能管理的目录，用一维数组出来
        3.index2/items/get_dir_page()     主要是获取所有自己能管理的目录，已经做了父级目录限制，例如：当dir_father_id =0
        3.index2/items/get_items_list()   主要是获取所有自己能管理的项目，已经做了父级目录限制，例如：当items_dir_id =0
        4.index2/items/space_list()       主要是获取所有自己能管理的项目与目录，获取的是 get_dir_page()+ get_items_list()
     * 
     * http://localhost/test_3/20181026/ky/todo/todo.kangyun3d.cn/public/index.php/index2/items/rename_dir
     *  */    


    //管理员获取所有文件夹,不能分页，需要递归
    public function get_all_dir_list($entity){ //不做分页，有get_dir_tree()方法做树杈


         /* $test_data=[
            'user_type' =>1,
            'company_id' =>1,
            'user_id' =>1,
            'dir_father_id' => 0,//项目文件夹的父级目录
        ];

        $entity = $test_data; */ 
        
        

        try{    
            //获取文件夹列表
            $dir_list=Db::name('items_dir')
            // ->where($where_dir_father_id)
            ->where('company_id','=',$entity['company_id'] )
        //  ->where($where_user)
            //->limit($entity['page_num'],$entity['limit_num'])
            ->select();
            if(!empty($dir_list)){ //有数据
                $result['code']=200;
                $result['message']='管理员获取文件夹数据成功！！！';
                
                $result['data']=$dir_list;

            }else{ 
                $result['code'] = 201;
                $result['message'] = '管理员没有任何文件夹';
                $return['data']=[];
            }

        }catch(\Exception $e){

            $result['code'] = 401;
            $result['message'] = $e->getMessage();
            $return['data']=[];
        } 
        return $result;
    }

    //普通合作者获取所有文件夹,包括邀请管理目录,，需要递归后再分页
    public function get_coop_dir_list($entity){ //使方法最好不做分页，因为是用于递归树杈,
        /* $test_data=[
            'user_type' =>1,
            'company_id' =>1,
            'user_id' =>2,
           // 'dir_father_id' => 11,//项目文件夹的父级目录
            'invite_user_id' => 2,
        ];
        $entity = $test_data; */ 

        try{    
            //获取文件夹列表
            $one_dir_list=Db::name('items_dir')
            // ->where($where_dir_father_id)
            // ->where( 'dir_father_id','0') //不能直接去数据库查询
            // ->where('company_id','=',$entity['company_id'] )
            ->where('user_id',$entity['user_id'])//不能直接去数据库查询
            //->limit($entity['page_num'],$entity['limit_num'])
            ->select();
           
            if(empty( $one_dir_list)){ //如果自己的文件夹为空的话
                $one_dir_list=array();
            }else{
                $one_dir_list_update=array();
                foreach($one_dir_list as $v){ 
                    $temp=1;
                    foreach($one_dir_list as $v2){
                                        
                        if($v2['id'] == $v['dir_father_id']){ //证明还可以拥有更高级的目录权限
                            $temp =2;
                            break;
                        }
                    }
                    if($temp == 1 ){  //证明dir_father_id 的 目录权限没有
                        // $share_dir_list[]['dir_father_id']=0;
                        //合作者没有更高级的目录了，只能讲dir_father_id=0在前端遍历出来
                        $v['dir_father_id'] =0;
                                        
                    }
                        
                    unset($temp);
                    $one_dir_list_update[]=$v;//
                }
                $one_dir_list = $one_dir_list_update;
            }



            //获取非自己创建但有权限管理的文件夹
            $share_dir_list=Db::name('invite_cooperator')
                            ->alias('i_c')
                            ->join('items_dir i_d','i_c.invite_items_id = i_d.id')
                            ->where('i_c.invite_user_id',$entity['user_id'])
                            ->where('i_c.is_dir_items',1) //1代表是文件夹
                          //  ->where( $where_dir_father_id) //不能找最顶层不是自己的文件夹用dir_father_id=0
                           // ->field('i_d.*')
                            ->field('i_d.*,i_c.invite_items_id,i_c.edit_type,i_c.is_dir_items')
                            ->select();  
            //为了递归需要将 $share_dir_list 的 没有父级目录权限的的 dir_father_id改为0
          //  $dir_father_id=array();
           // $dir_id=array();
           
            if(!empty($share_dir_list) ){ //非自己但可以管理的文件夹
                $share_dir_list_update=array();

                
                    foreach($share_dir_list as $v){ 
                        $temp=1;
                        foreach($share_dir_list as $v2){
                                            
                            if($v2['id'] == $v['dir_father_id']){ //证明还可以拥有更高级的目录权限
                                $temp =2;
                            }
                        }
                        if($temp == 1 ){  //证明dir_father_id 的 目录权限没有
                            // $share_dir_list[]['dir_father_id']=0;
                            //合作者没有更高级的权限了，只能讲dir_father_id=0在前端遍历出来
                            $v['dir_father_id'] =0;
                                            
                        }
                            // $dir_id [] = $v['id'];
                             //$dir_father_id [] = $v['dir_father_id'];
                             /* if($v['dir_father_id'] == ){

                            } */
                        unset($temp);
                        $share_dir_list_update[]=$v;//
                    }
                    
                
                
           }else{
               $share_dir_list_update=array();//没有找到可以管理的非自己文件夹
           }
           
           
            
              
               // $one_dir_list_get_tree=$this->get_tree($one_dir_list,0);//已经将非自己创建可管理的最高级dir_father_id目录改为0
            //$result['data']['one_dir_lsit']['data']=$one_dir_list;//所有一维
           // $result['data']['share_dir_list_update']['data']=$share_dir_list_update;//所有一维
                //$result['data']['one_dir_list']['data']=$one_dir_list;//所有一维
               // $result['data']['one_dir_list']['count']= count($one_dir_list);//所有一维条数
              //  $result['data']['one_dir_list_get_tree']['data']=$one_dir_list_get_tree;//树杈
              //  $result['data']['one_dir_father_list']['data']=$one_dir_father_list; //通过定义父级目录
              //  $result['data']['one_dir_father_list']['count']= count($one_dir_father_list); //通过定义父级目录的条数
                 

           // $one_share_dir_list=array_merge($one_dir_list,$share_dir_list); 
            $one_share_dir_list=array_merge($one_dir_list,$share_dir_list_update); 
            // print_r(  $one_share_dir_list);
           //$result['data']['one_share_dir_list']['data']=$one_share_dir_list;
            
          //  $result['data']=$share_dir_list_update;
         //   $result['data']['one_share_dir_list']['dir_id']=$dir_id;
         //   $result['data']['one_share_dir_list']['dir_father_id']=$dir_father_id;
            
           if(!empty($one_share_dir_list)){
                $result['code']=200;
                $result['message']='用户获取文件夹数据成功！！！';
                $result['data']=$one_share_dir_list;
           }else{
                $result['code']=201;
                $result['message']='用户获取文件夹数为空，没有任何文件夹权限';
                $return['data']=[];
           }
                
                
                

            
           

        }catch(\Exception $e){

            $result['code'] = 401;
            $result['message'] = $e->getMessage();
            $return['data']=[];
        } 
        return $result;
    }
   
    //递归获取文件夹，前端调用该方法
    public function get_dir_tree($entity){

        /* $test_data=[
            'user_type' =>3,
            'company_id' =>1,
            'user_id' =>2,
            //'dir_father_id' => 0,//项目文件夹的父级目录
        ];
        $entity = $test_data; */

        if(empty($entity['company_id'])){
            throw new \Exception('没有传入公司id');
        }
        if(empty($entity['user_id'])){
            throw new \Exception('没有传入用户id');
        }
        //判断用户类型

        if(intval($entity['user_type'])  === 1 || intval($entity['user_type'])  === 2){//管理员
        
            $result=$this->get_all_dir_list($entity);
        }else if(intval($entity['user_type'])  === 3){//合作者

            $result=$this->get_coop_dir_list($entity);

        }else{
            throw new \Exception('传入的用户权限类型不正确！！');
        }

        
     // $result=$this->get_all_dir_list($entity);
        if( $result['code'] == 200 ){  //证明有数据
            $result['data']=$this->get_tree( $result['data'],0);
        }



        return $result;
    }

    

    //获取所有的文件夹列表
    public function get_dir_list($entity){
        /* $test_data=[
            'user_type' =>3,
            'company_id' =>1,
            'user_id' =>2,
           // 'items_dir_id' => 18,//项目文件夹的父级目录
        ];
        $entity = $test_data; */

        if(empty($entity['company_id'])){
            throw new \Exception('没有传入公司id');
        }
        if(empty($entity['user_id'])){
            throw new \Exception('没有传入用户id');
        }

        if(empty($entity['dir_father_id'])){
            $entity['dir_father_id'] = 0;
        }
        
        //判断用户类型

        if(intval($entity['user_type'])  === 1 || intval($entity['user_type'])  === 2){//管理员
        
            $result=$this->get_all_dir_page($entity);
        }else if(intval($entity['user_type'])  === 3){//合作者

            $result=$this->get_coop_dir_page($entity);

        }else{
            throw new \Exception('传入的用户权限类型不正确！！');
        }
        
        //判断用户类型

        if(intval($entity['user_type'])  === 1 || intval($entity['user_type'])  === 2){//管理员
           
            $result=$this->get_all_dir_list($entity);
        }else{//合作者
            $result=$this->get_coop_dir_list($entity);
        }

        
       /* // $result=$this->get_all_dir_list($entity);
        if( $result['code'] == 200 ){  //证明有数据
            $result['data']=$this->get_tree( $result['data'],0);
        } */



        return $result;
    }

    //管理员获取文件夹，分页列表
    public function get_all_dir_page($entity){//分页
       /*  $test_data=[
            'user_type' =>1,
            'company_id' =>1,
            'user_id' =>1,
            'dir_father_id' => 0,//项目文件夹的父级目录
        ];
        $entity = $test_data; 
        */
        try{    
            //获取文件夹列表
            $dir_list=Db::name('items_dir')
            // ->where($where_dir_father_id)
            ->where('company_id',$entity['company_id'] )
            ->where('dir_father_id',$entity['dir_father_id'] )
            //  ->where($where_user)
            //->limit($entity['page_num'],$entity['limit_num'])
            ->select();
            if(!empty($dir_list)){ //有数据
                $result['code']=200;
                $result['message']='管理员获取文件夹数据成功！！！';
                
                $result['data']=$dir_list;

            }else{ 
                $result['code'] = 201;
                $result['message'] = '管理员没有任何文件夹';
                $return['data']=[];
            }

        }catch(\Exception $e){

            $result['code'] = 401;
            $result['message'] = $e->getMessage();
            $return['data']=[];
        } 
        return $result;
        

    }

    //合作者获取文件夹，分页列表
    public function get_coop_dir_page($entity){//分页
        /* $test_data=[
            'user_type' =>1,
            'company_id' =>1,
            'user_id' =>2,
            'dir_father_id' => 11,//项目文件夹的父级目录
            'invite_user_id' => 2,
        ];
        $entity = $test_data;  eee*/

        $dir_father_id = !empty( $entity['dir_father_id']) ?  $entity['dir_father_id'] : 0 ;
        try{    
            //获取文件夹列表、
            if($dir_father_id > 0){
                $one_dir_list=Db::name('items_dir')
                            ->where('user_id',$entity['user_id'])
                            ->where('dir_father_id',$dir_father_id)
                            ->limit('0')
                            //->limit($entity['page_num'],$entity['limit_num'])
                            ->select();
            }else{//father_dir_id等于0，自己本身最高级拥有文件夹father_dir_id未必等于0,因为没有更高级的非自己创建的目录，所以需要把自己创建的目录的fatehr_dir_id=0
                $one_dir_list=Db::name('items_dir')
                            ->where('user_id',$entity['user_id'])
                           // ->where('dir_father_id',$dir_father_id)
                           // ->limit('0')
                            //->limit($entity['page_num'],$entity['limit_num'])
                            ->select();
                if(empty( $one_dir_list)){ //如果自己的文件夹空的话空的
                    $one_dir_list=array();
                }else{ 
                    $one_dir_list_update=array();
                    foreach($one_dir_list as $v){ //只有dir_father_id=0时或则没有dir_father_id时才加载
                        
                        $temp=1;
                        foreach($one_dir_list as $v2){
                                            
                            if($v2['id'] == $v['dir_father_id']){ //证明还有更高级的自己创建的目录
                                $temp =2;
                                break;
                            }
                        }
                        if($temp == 1 ){  //证明dir_father_id 的 目录权限没有
                            // $share_dir_list[]['dir_father_id']=0;
                            //合作者没有更高级的目录了，只能讲dir_father_id=0在前端遍历出来
                            $v['dir_father_id'] =0;
                            $one_dir_list_update[]=$v;//只获取最高级的文件夹

                                            
                        }
                            
                        unset($temp);
                        //$share_dir_list_update[]=$v;//
                        $temp_share_get_limit++; //执行需要limit的条数,需要先减去自己的文件夹的条数才能到这里
                        /* if($temp_share_get_limit++ == 2){
                            break;
                        } */

                    }
                    $one_dir_list=$one_dir_list_update;

                }
            }
            
           
            if(empty( $one_dir_list)){ //如果自己的文件夹空的话空的
                $one_dir_list=array();
            }

            //只有dir_father_id=0时或则没有dir_father_id时才加载
            if($dir_father_id > 0){ //证明文件夹不是最高级加载
              //  $where_dir_father_id = " 1=1 and dir_father_id = ".$dir_father_id;
            

                $share_dir_list=Db::name('invite_cooperator')
                            ->alias('i_c')
                            ->join('items_dir i_d','i_c.invite_items_id = i_d.id')
                            ->where('i_c.invite_user_id',$entity['user_id'])
                            ->where('i_c.is_dir_items',1) //1代表是文件夹
                            ->where('dir_father_id',$dir_father_id) 
                            //->limit()
                           // ->field('i_d.*')
                            ->field('i_d.*,i_c.invite_items_id,i_c.edit_type,i_c.is_dir_items')
                            ->select(); 
                
                 if(!empty($share_dir_list) ){ //非自己但可以管理的文件夹
                    $share_dir_list_update = $share_dir_list;
    
                    
                   /*  foreach($share_dir_list as $v){ //只有dir_father_id=0时或则没有dir_father_id时才加载
                        $temp=1;
                        foreach($share_dir_list as $v2){
                                            
                            if($v2['id'] == $v['dir_father_id']){ //证明还有更高级的目录权限
                                $temp =2;
                            }
                        }
                        if($temp == 1 ){  //证明dir_father_id 的 目录权限没有
                            // $share_dir_list[]['dir_father_id']=0;
                            //合作者没有更高级的权限了，只能讲dir_father_id=0在前端遍历出来
                            $v['dir_father_id'] =0;
                            $share_dir_list_update[]=$v;//只获取最高级的文件夹
                                            
                        }
                            
                        unset($temp);
                        //$share_dir_list_update[]=$v;//
                    }  */
                        
                    
                    
                }else{
                    $share_dir_list_update=array();//没有找到可以管理的非自己文件夹
                }

            }else{//等于0可能是非自己的目录本身也是0，也有可能是该文件不能拥有更高级的文件夹时设置为0
               

                $share_dir_list=Db::name('invite_cooperator')
                                ->alias('i_c')
                                ->join('items_dir i_d','i_c.invite_items_id = i_d.id')
                                ->where('i_c.invite_user_id',$entity['user_id'])
                                ->where('i_c.is_dir_items',1) //1代表是文件夹
                               // ->field('i_d.*')
                                ->field('i_d.*,i_c.invite_items_id,i_c.edit_type,i_c.is_dir_items')
                                ->select(); 

                if(!empty($share_dir_list) ){ //非自己但可以管理的文件夹
                    $share_dir_list_update = array();
    
                    $temp_share_get_limit=0;
                    foreach($share_dir_list as $v){ //只有dir_father_id=0时或则没有dir_father_id时才加载
                        
                        $temp=1;
                        foreach($share_dir_list as $v2){
                                            
                            if($v2['id'] == $v['dir_father_id']){ //证明还有更高级的目录权限
                                $temp =2;
                                break;
                            }
                        }
                        if($temp == 1 ){  //证明dir_father_id 的 目录权限没有
                            // $share_dir_list[]['dir_father_id']=0;
                            //合作者没有更高级的权限了，只能讲dir_father_id=0在前端遍历出来
                            $v['dir_father_id'] =0;
                            $share_dir_list_update[]=$v;//只获取最高级的文件夹

                                            
                        }
                            
                        unset($temp);
                        //$share_dir_list_update[]=$v;//
                        $temp_share_get_limit++; //执行需要limit的条数,需要先减去自己的文件夹的条数才能到这里
                        /* if($temp_share_get_limit++ == 2){
                            break;
                        } */

                    }
                       
                   


                    
                }else{
                    $share_dir_list_update=array();//没有找到可以管理的非自己文件夹
                }


                
            }

            

            //获取非自己创建但有权限管理的文件夹
            
            //为了递归需要将 $share_dir_list 的 没有父级目录权限的的 dir_father_id改为0
          //  $dir_father_id=array();
           // $dir_id=array();
           
            
           /* if(!empty($share_dir_list) ){ //非自己但可以管理的文件夹
                $share_dir_list_update = array();

                if($dir_father_id == 0){ //证明是最高级文件夹加载
                
                    foreach($share_dir_list as $v){ //只有dir_father_id=0时或则没有dir_father_id时才加载
                        $temp=1;
                        foreach($share_dir_list as $v2){
                                            
                            if($v2['id'] == $v['dir_father_id']){ //证明还有更高级的目录权限
                                $temp =2;
                            }
                        }
                        if($temp == 1 ){  //证明dir_father_id 的 目录权限没有
                            // $share_dir_list[]['dir_father_id']=0;
                            //合作者没有更高级的权限了，只能讲dir_father_id=0在前端遍历出来
                            $v['dir_father_id'] =0;
                            $share_dir_list_update[]=$v;//只获取最高级的文件夹
                                            
                        }
                            
                        unset($temp);
                        //$share_dir_list_update[]=$v;//
                    }
                }    
                
                
           }else{
               $share_dir_list_update=array();//没有找到可以管理的非自己文件夹
           } */
           
     //         <--------------------------|
     //                                    |
     //                                    |
     //                                    |
     //                                    |
     //                                    |
     //                                    |
     //                                    |
     //                                    |
     //       <----------------------------|

            
              
            $one_share_dir_list=array_merge($one_dir_list,$share_dir_list_update); 
            
            
           // $dir_father_id;
            
           if(!empty($one_share_dir_list)){
                $result['code']=200;
                $result['message']='用户获取文件夹数据成功！！！';
                $result['data']=$one_share_dir_list;
           }else{
                $result['code']=201;
                $result['message']='用户获取文件夹数为空，没有任何文件夹权限';
                $return['data']=[];
           }
                
                
                

            
           

        }catch(\Exception $e){

            $result['code'] = 401;
            $result['message'] = $e->getMessage();
            $return['data']=[];
        } 
        return $result;
        

    }

    //获得文件夹页面列表，前端调用该方法
    public function get_dir_page($entity){

        /* $test_data=[
            'user_type' =>1,
            'company_id' =>1,
            'user_id' =>2,
            'dir_father_id' => 0,//项目文件夹的父级目录
        ];
        $entity = $test_data; */

        if(empty($entity['company_id'])){
            throw new \Exception('没有传入公司id');
        }
        if(empty($entity['user_id'])){
            throw new \Exception('没有传入用户id');
        }

        if(empty($entity['dir_father_id'])){
            $entity['dir_father_id'] = 0;
        }
        
        //判断用户类型

        if(intval($entity['user_type'])  === 1 || intval($entity['user_type'])  === 2){//管理员
        
            $result=$this->get_all_dir_page($entity);
        }else if(intval($entity['user_type'])  === 3){//合作者

            $result=$this->get_coop_dir_page($entity);

        }else{
            throw new \Exception('传入的用户权限类型不正确！！');
        }

        
       
        return $result;
    }

    
    
    

    //调用递归的方法
    public function get_tree($a,$pid){
        $tree = array();                                //每次都声明一个新数组用来放子元素
        foreach($a as $v){
            if($v['dir_father_id'] == $pid){                      //匹配子记录
                $v['children'] = $this->get_tree($a,$v['id']); //递归获取子记录
                if($v['children'] == null){
                unset($v['children']);             //如果子元素为空则unset()进行删除，说明已经到该分支的最后一个元素了（可选）
                }
                $tree[] = $v;                          //将记录存入新数组
            }
            
        }
        return $tree;                                  //返回新数组
    }



    //管理员项目列表
    public function get_all_items_list($entity){
        $items_dir_id= !empty($entity['items_dir_id']) ? $entity['items_dir_id'] : 0;
       
        try{

            $all_items_list=Db::name('items')
                    ->where('company_id',1)
                    ->where('items_dir_id',$items_dir_id)
                    //->where('company_id',$entity['company_id'])
                    ->select();

            if(!empty($all_items_list)){ //有数据
               // echo 2;
                $result['code']=200;
                $result['message']='管理员获取项目数据成功！！！';
               // print_r($all_items_list);
                $result['data']=$all_items_list;

            }else{ 
                $result['code'] = 201;
                $result['message'] = '没有任何文件项目';
                $return['data']=[];
            }

        }catch(\Exception $e){
            $result['code'] = '401';
            $result['message'] = $e->getMessage();
            $return['data']=[];
        }
        return $result;
    }

    //合作者项目列表
    public function get_coop_items_list($entity){
        $items_dir_id = !empty($entity['items_dir_id']) ? $entity['items_dir_id'] : 0;
        //$user_id= !empty($entity['user_id']) ? $entity['user_id'] : 2;
        try{

            
            
            //自己的项目
            if($items_dir_id > 0){
                $one_items_list = Db::name('items')
                            ->where('company_id',$entity['company_id'])
                            ->where('user_id',$entity['user_id'])
                            ->where('items_dir_id',$items_dir_id)
                            // ->where('items')
                            //->where('company_id',$entity['company_id'])
                            ->select(); 
                if(empty($one_items_list)){
                    $one_items_list=array();
                }            
            }else{ //搜索自己文件的父级==0，可能真是未必是等于0，需要改为items_dir_id=0，在前端渲染出来
                $one_items_list = Db::name('items')
                ->where('company_id',$entity['company_id'])
                ->where('user_id',$entity['user_id'])
                //->where('items_dir_id',$items_dir_id)
                // ->where('items')
                //->where('company_id',$entity['company_id'])
                ->select(); 
                if(empty($one_items_list)){
                    $one_items_list=array();
                }else{//需要将所属文件夹不是自己创建的改为0
                    $oneitems_list_update = array();
    
                    foreach($share_items_list as $v){
                        $v['items_dir_id'] = 0;
                        $one_items_list_update[] = $v;
                    }
                    $one_items_list= $one_items_list_update;
                }

            }
            

            if($items_dir_id > 0){ 
                $share_items_list = Db::name('invite_cooperator')
                                    ->alias('i_c')
                                    ->join('items i','i_c.invite_items_id = i.id')
                                    ->where('i_c.invite_user_id',$entity['user_id'])
                                    ->where('i.items_dir_id',$items_dir_id)
                                    ->where('i_c.is_dir_items',2) //2代表是文件
                                    ->limit(0)
                                    ->field('i.*,i_c.invite_items_id,i_c.edit_type,i_c.is_dir_items')
                                    ->select();
                if(empty($share_items_list)){
                    $share_items_list_update=array();
                }else{
                    $share_items_list_update=$share_items_list;
                }
            }else{ //首页搜索 //最高级文件夹的文件 
                //$items_dir_id==0可能本身文件夹等于0，也有可能不等于0，但为了合作者显示在前端必须设置为0


                $share_items_list = Db::name('invite_cooperator')
                                    ->alias('i_c')
                                    ->join('items i','i_c.invite_items_id = i.id')
                                    ->where('i_c.invite_user_id', $entity['user_id'])
                                    ->where('i_c.is_dir_items',2) //2代表是文件
                                   // ->where('i.items_dir_id',$items_dir_id)
                                    ->limit(0)
                                    ->field('i.*,i_c.invite_items_id,i_c.edit_type,i_c.is_dir_items')
                                    ->select();

                if(!empty($share_items_list) ){ //非自己但可以管理的文件夹
                    $share_items_list_update = array();
    
                    foreach($share_items_list as $v){
                        $v['items_dir_id'] = 0;
                        $share_items_list_update[] = $v;
                    }
                       
                   

                    //echo 222222222222;
                    
                }else{
                    $share_items_list_update=array();//没有找到可以管理的非自己项目
                }

            }  
            
            

            /* if( $items_dir_id == 0){ //只有首页才会是文件分享，如果是其他就是文件夹的形式分享了
                if(empty($coop_items_list)){
                        $coop_items_list=array();
                }

                    /**
                        Db::table('think_artist')
                                    ->alias('a')
                                    ->join('think_work w','a.id = w.artist_id')
                                    ->join('think_card c','a.card_id = c.id')
                                    ->select(); 
                                */
               /*  $share_items_list= Db::name('invite_cooperator')
                                    ->alias('i_c')
                                    ->join('items_dir i_d','i_c.invite_items_id = i_d.id')
                                    ->field('i_d.*,i_c.invite_items_id,i_c.edit_type,i_c.is_dir_items')
                                    ->select();
                $coop_items_list = array_merge($coop_items_list,$share_items_list);
            } */ 
            
            $coop_items_list = array_merge($one_items_list,$share_items_list_update);
            //非自己但可以看见的项目   
            if(!empty($coop_items_list)){ //有数据
                $result['code']=200;
                $result['message']='合作者获取项目数据成功！！！';
                
                $result['data']= $coop_items_list;
                //$result['data']=$coop_items_list;

            }else{ 
                $result['code'] = 201;
                $result['message'] = '没有任何文件项目';
                $return['data']=[];
            }
        }catch(\Exception $e){
            $result['code'] = '401';
            $result['message'] = $e->getMessage();
            $return['data']=[];
        }

        return $result;
    }

    //项目列表
    public function get_items_list($entity){
        
        /* $test_data=[
            'user_type' =>1,
            'company_id' =>1,
            'user_id' =>2,
            'items_dir_id' => 18,//项目文件夹的父级目录
        ];
        $entity = $test_data; */

        if(empty($entity['company_id'])){
            throw new \Exception('没有传入公司id');
        }
        if(empty($entity['user_id'])){
            throw new \Exception('没有传入用户id');
        }

        if(empty($entity['dir_father_id'])){
            $entity['dir_father_id'] = 0;
        }
        
        //判断用户类型

        if(intval($entity['user_type'])  === 1 || intval($entity['user_type'])  === 2){//管理员
        
            $result=$this->get_all_dir_page($entity);
        }else if(intval($entity['user_type'])  === 3){//合作者

            $result=$this->get_coop_dir_page($entity);

        }else{
            throw new \Exception('传入的用户权限类型不正确！！');
        }
        
        //判断用户类型

        if(intval($entity['user_type'])  === 1 || intval($entity['user_type'])  === 2){//管理员
           
            $result=$this->get_all_items_list($entity);
        }else{//合作者
            $result=$this->get_coop_items_list($entity);
        }

        
       /* // $result=$this->get_all_dir_list($entity);
        if( $result['code'] == 200 ){  //证明有数据
            $result['data']=$this->get_tree( $result['data'],0);
        } */



        return $result;
    }
    
   


    //获取空间列表,需要考虑管理员与合作者，包括了单个项目和文件夹内容
    public function space_list($entity){

        $limit_num = !empty($entity['limit_num'])  ? $entity['limit_num'] : 10;
        $pageno = !empty($entity['pageno']) ? $entity['pageno'] : 0;
        if ($pageno == '') {
            $page_num = 0;
        } else {
            $page_num =  $limit_num * ($pageno - 1);
        }

        /* $test_data=[
            'user_type' =>3,
            'company_id' =>1,
            'user_id' =>2,
            'dir_father_id'=>0,//如果没有该变量，或者为0，证明是首先加载页面，
            'items_dir_id'=>0,//如果没有该变量，或者为0，证明是首先加载页面
            //''=>,  //分页 limit
        ]; 
        $entity=$test_data;

        */
        if(empty($entity['company_id'])){
            throw new \Exception('没有传入公司id');
        }
        if(empty($entity['user_id'])){
            throw new \Exception('没有传入用户id');
        }

        if(empty($entity['dir_father_id'])){
            $entity['dir_father_id'] = 0;
        }
        
        //判断用户类型

        if(intval($entity['user_type'])  === 1 || intval($entity['user_type'])  === 2){//管理员
        
                $result['data']['dir']=$this->get_all_dir_page($entity);
                $result['data']['items']=$this->get_all_items_list($entity);
                if($result['data']['dir']['code'] == 201 && $result['data']['items']['code'] == 201 ){
                    $result['code'] = 201;
                    $result['message'] = '管理员没有任何文件夹和项目！！！';
                    
                }else{
                    $result['code'] = 200;
                    $result['message'] = '管理员获取文件夹或项目成功！！！';
                  
                }
        }else if(intval($entity['user_type'])  === 3){//合作者

                $result['data']['dir']=$this->get_coop_dir_page($entity);
               $result['data']['items']=$this->get_coop_items_list($entity);

                if($result['data']['dir']['code'] ==201 && $result['data']['items']['code'] == 201 ){
                         $result['code'] = 201;
                         $result['message'] = '用户没有任何文件夹和项目！！！';
                         
                }else{
                        $result['code'] = 200;
                        $result['message'] = '用户获取文件夹或项目成功！！！';
                }

        }else{
            throw new \Exception('传入的用户权限类型不正确！！');
        }




        /* try{
            //先
            if(intval($entity['user_type'])  === 1 || intval($entity['user_type'])  === 2){//管理员
              //  $result['data']['dir']=$this->get_all_dir_page($entity);
               // $result['data']['items']=$this->get_all_items_list($entity);
            }else{//合作者
              //  $result['data']['dir']=$this->get_coop_dir_page($entity);
              //  $result['data']['items']=$this->get_coop_items_list($entity);
            }

            

            //获取目录列表
        }catch(\Exception $e){
            $result['code'] = 401;
            $result['message'] = $e->getMessage();
        }
        */
        return $result;

    }


    //创建空间列表文件夹
    public function create_dir($entity){
        
        /* $test_data=[
            'user_type' =>3,
            'company_id' =>1,
            'user_id' =>2,
            'dir_id' => 44, //需要在那个文件夹下创建文件夹
            'dir_name' =>'dir——name',

        ]; 
        $entity=$test_data;
        */
        
        if(empty($entity['company_id'])){
            throw new \Exception('没有传入公司id');
        }
        if(empty($entity['user_id'])){
            throw new \Exception('没有传入用户id');
        }

        if(empty($entity['dir_name'])){
            throw new \Exception('文件夹名称不能为空！！');
        }

        try{

            if(intval($entity['user_type'])  === 1 || intval($entity['user_type'])  === 2){//管理员
                
                if(empty($entity['dir_id'])){ //即使是0也没关系，让他dir_father_id == 0
                    $entity['dir_id'] = 0;
                   
                }else{
                    
                    //先查找，看看数据库中是否还有该目录
                    $find_dir = Db::name('items_dir')->where('id',$entity['dir_id'])->field('id')->find();
                    
                    if(empty($find_dir)){ //证明没有该文件夹
                        throw new \Exception('插入失败，目录不存在！');
                        
                    } 

                   
                    
                }
                 $dir_creator = $entity['user_id'] ; //文件夹创建人

                /* $save_data=[
                    'dir_father_id' =>$entity['dir_id'],
                    'user_id' => $entity['user_id'],
                    'company_id' => $entity['company_id'],
                    'create_time' => time(),

                ];

                $add_dir=Db::name('items_dir')->insertGetId($save_data); 

                if(!empty($add_dir)){   //插入成功
                    $result['code'] = 200;
                    $result['message'] = "文件夹插入成功";
                    $result['data'] = ['dir_id'=> $add_dir];
                }else{

                    $result['code'] = 201;
                    $result['message'] = "文件夹插入失败";
                    $result['data'] = [];

                } */



                
        
            }else if(intval($entity['user_type'])  === 3){//合作者
                //合作者需要判断编辑类型

                if(empty($entity['dir_id'])){ //即使是0也没关系，让他dir_father_id == 0
                    $entity['dir_id'] = 0;
                    
                }else{
                    
                    //先查找，看看数据库中是否还有该目录
                    $find_dir = Db::name('items_dir')->where('id',$entity['dir_id'])->field('id,user_id')->find();
                    
                    if(empty($find_dir)){ //证明没该文件夹
                        throw new \Exception('插入失败，目录不存在！');
                        
                    }else{ 
                        if($find_dir['user_id'] != $entity['user_id'] ){ //证明该文件夹不是本人所有                             
                            //去邀请的数据库中看看有没有被邀请,并且可以编辑
                            $find_edit_type=Db::name('invite_cooperator')
                                            ->where('invite_items_id',$entity['dir_id'])//编辑的文件夹id
                                            ->where('invite_user_id',$entity['user_id']) //邀请的用户id
                                            ->where('is_dir_items',1) //1是文件夹
                                            ->where('edit_type','=','2' ) //2是可以编辑
                                            ->find();
                            if(empty($find_edit_type)){ //证明数据不匹配
                                throw new \Exception('创建文件夹失败，该合作者没有拥有修改该目录的权限！');
                            }
                            //将自己创建的文件夹归父级文件夹创建人所有
                            $dir_creator =  $find_dir['user_id'];//文件夹父级目录创建者
                        }/* else{//证明该文件夹是本人所有 
                            $dir_creator = $entity['user_id'] ;//证明是自己创建的
                        } */

                        
                    }

                    
                    
                    
                    
                }
                $dir_creator = $entity['user_id'] ;//证明是自己创建的

                /* $save_data=[
                        'dir_father_id' =>$entity['dir_id'],
                        'user_id' => $entity['user_id'],
                        'company_id' => $entity['company_id'],
                        'create_time' => time(),

                ];

                $add_dir=Db::name('items_dir')->insertGetId($save_data);   */

    
            }else{

                throw new \Exception('传入的用户权限类型不正确！！');
            }


            //对文件夹进行插入文件夹操作

            $save_data=[
                'dir_father_id' =>$entity['dir_id'],
               // 'user_id' => $entity['user_id'],
                'user_id' =>  $dir_creator, //如果父级目录不是归自己所有，自己创建的目录归父级目录创建者所有 
                'company_id' => $entity['company_id'],
                'dir_name' => $entity['dir_name'],
                'create_time' => time(),

            ];

            $add_dir=Db::name('items_dir')->insertGetId($save_data); 
            
                  

            if(!empty($add_dir)){   //插入成功

                //去看看该父级目录下的分享情况,添加之前所有可以共享该目录的合作者
                $temp_find_invite=Db::name('invite_cooperator')
                ->where('invite_items_id',$entity['dir_id'])//编辑的文件夹id,0就不需要关注了
                //->where('invite_user_id',$entity['user_id']) //邀请的用户id
                ->where('is_dir_items',1) //1是文件夹
                //->where('edit_type','=','2' ) //2是可以编辑
                ->select();

                $son_add_dir_invite=array();
                if(!empty( $temp_find_invite)){ //就给之前的父级目录的权限的邀请者添加刚刚创建的子级目录权限
                    foreach($temp_find_invite as $v){//遍历插入
                        $temp_aa=array();
                        $temp_aa['invite_user_id']=$v['invite_user_id'];
                        $temp_aa['company_id']=$v['company_id'];
                        $temp_aa['invite_items_id']=$add_dir;//刚刚新增的文件夹id
                        $temp_aa['is_dir_items'] = 1;  //文件夹
                        $temp_aa['edit_type']=$v['edit_type'];//继承父级的权限
                        $temp_aa['create_time']=time();

                        $son_add_dir_invite[] =$temp_aa;
                    }
                    //echo "<pre>";
                   // print_r($son_add_dir_invite);
                   //添加新子级目录权限，到时候可能加上事务进行操作
                    Db::name('invite_cooperator')->insertAll($son_add_dir_invite);
                }
                
                $result['code'] = 200;
                $result['message'] = "文件夹插入成功";
                $result['data'] = array('dir_id'=> $add_dir);
            }else{

                $result['code'] = 201;
                $result['message'] = "文件夹插入失败";
                $result['data'] = [];

            }
            
           // echo $add_dir;

        



        }catch(\Exception $e){

            $result['code'] = 401;
            $result['message'] = $e->getMessage();
            $return['data']=[];
        }

        return $result;
    
    }

    //文件夹重命名
    public function rename_dir($entity){
        
         /* $test_data=[
            'user_type' =>1,
            'company_id' =>1,
            'user_id' =>2,
            'dir_id' => 46, //需要修改的文件夹id
            'dir_name' =>'new_name',

        ]; 
        $entity=$test_data;  
        */
        
        if(empty($entity['company_id'])){
            throw new \Exception('没有传入公司id');
        }
        if(empty($entity['user_id'])){
            throw new \Exception('没有传入用户id');
        }
        if(empty($entity['dir_id'])){ 
            throw new \Exception('没有传入要修改的文件夹id，dir_id');
           
        }
        if(empty($entity['dir_name'])){
            throw new \Exception('文件夹名称不能为空！！');
        }
        

        try{

            if(intval($entity['user_type'])  === 1 || intval($entity['user_type'])  === 2){//管理员
                
                
                    
                    //先查找，看看数据库中是否还有该目录
                    $find_dir = Db::name('items_dir')->where('id',$entity['dir_id'])->field('id')->find();
    
                    if(empty($find_dir)){ //证明没有该文件夹
                        throw new \Exception('修改失败，目录不存在！');
                        
                    } 
                    
                

                /* $save_data=[
                    'dir_father_id' =>$entity['dir_id'],
                    'user_id' => $entity['user_id'],
                    'company_id' => $entity['company_id'],
                    'create_time' => time(),

                ];

                $add_dir=Db::name('items_dir')->insertGetId($save_data); 

                if(!empty($add_dir)){   //插入成功
                    $result['code'] = 200;
                    $result['message'] = "文件夹插入成功";
                    $result['data'] = ['dir_id'=> $add_dir];
                }else{

                    $result['code'] = 201;
                    $result['message'] = "文件夹插入失败";
                    $result['data'] = [];

                } */



                
        
            }else if(intval($entity['user_type'])  === 3){//合作者
                //合作者需要判断编辑类型

                
                    
                    //先查找，看看数据库中是否还有该目录,
                    $find_dir = Db::name('items_dir')->where('id',$entity['dir_id'])->field('id,user_id')->find();
                    
                    if(empty($find_dir)){ //证明没该文件夹
                        throw new \Exception('修改失败，目录不存在！');
                        
                    }else{ 
                        if($find_dir['user_id'] != $entity['user_id'] ){ //证明该文件夹不是本人所有 
                            //去邀请的数据库中看看有没有被邀请
                            $find_edit_type=Db::name('invite_cooperator')
                                            ->where('invite_items_id',$entity['dir_id'])//编辑的文件夹id
                                            ->where('invite_user_id',$entity['user_id']) //邀请的用户id
                                            ->where('is_dir_items',1) //1是文件夹
                                            ->where('edit_type','=','2' ) //2是可以编辑
                                            ->find();
                            if(empty($find_edit_type)){ //证明数据不匹配
                                throw new \Exception('修改文件夹失败，该合作者没有拥有修改该目录的权限！');
                            }
                            
                        }
                    }

                    
                    
                    
                    
                

                /* $save_data=[
                        'dir_father_id' =>$entity['dir_id'],
                        'user_id' => $entity['user_id'],
                        'company_id' => $entity['company_id'],
                        'create_time' => time(),

                ];

                $add_dir=Db::name('items_dir')->insertGetId($save_data);   */

    
            }else{

                throw new \Exception('传入的用户权限类型不正确！！');
            }


            //对文件夹进行插入文件夹操作

            $save_data=[
                  'id' =>$entity['dir_id'],
               // 'user_id' => $entity['user_id'],
               // 'company_id' => $entity['company_id'],
                'dir_name' => $entity['dir_name'],
                'update_time' => time(),

            ];

            $add_dir=Db::name('items_dir')->update($save_data); 

            if(!empty($add_dir)){   //插入成功
                $result['code'] = 200;
                $result['message'] = "文件夹名称修改成功";
                $result['data'] = [];
            }else{

                $result['code'] = 201;
                $result['message'] = "文件夹名称修改失败";
                $result['data'] = [];

            }
            
            


        



        }catch(\Exception $e){

            $result['code'] = 401;
            $result['message'] = $e->getMessage();
            $return['data']=[];
        }

        return $result;
    
    }


    //删除空间列表文件夹
    public function delete_dir($entity){
        
          /* $test_data=[
            'user_type' =>1,
            'company_id' =>1,
            'user_id' =>5,
            'dir_id' => 45, //需要删除哪个文件夹的id
            //'dir_name' =>'dir——name',
            //'dir_name' =>'dir——name',

        ]; 
        $entity=$test_data; */
        
        
        if(empty($entity['company_id'])){
            throw new \Exception('没有传入公司id');
        }
        if(empty($entity['user_id'])){
            throw new \Exception('没有传入用户id');
        }

        if(empty($entity['dir_id'])){ 
            throw new \Exception('没有传入要修改的文件夹id，dir_id');
           
        }

        

        try{

            if(intval($entity['user_type'])  === 1 || intval($entity['user_type'])  === 2){//管理员
                
                
                    
                    //先查找，看看数据库中是否还有该目录
                    $find_dir = Db::name('items_dir')->where('id',$entity['dir_id'])->field('id')->find();
                    
                    if(empty($find_dir)){ //证明没有该文件夹
                        throw new \Exception('删除失败，目录不存在！');
                        
                    }
                   
                    
                
                // $dir_creator = $entity['user_id'] ; //文件夹创建人

                /* $save_data=[
                    'dir_father_id' =>$entity['dir_id'],
                    'user_id' => $entity['user_id'],
                    'company_id' => $entity['company_id'],
                    'create_time' => time(),

                ];

                $add_dir=Db::name('items_dir')->insertGetId($save_data); 

                if(!empty($add_dir)){   //插入成功
                    $result['code'] = 200;
                    $result['message'] = "文件夹插入成功";
                    $result['data'] = ['dir_id'=> $add_dir];
                }else{

                    $result['code'] = 201;
                    $result['message'] = "文件夹插入失败";
                    $result['data'] = [];

                } */



                
        
            }else if(intval($entity['user_type'])  === 3){//合作者
                //合作者需要判断编辑类型

               
                    //先查找，看看数据库中是否还有该目录
                    $find_dir = Db::name('items_dir')->where('id',$entity['dir_id'])->field('id,user_id')->find();
                    
                    if(empty($find_dir)){ //证明没该文件夹
                        throw new \Exception('删除失败，目录不存在！');
                        
                    }else{ 
                        if($find_dir['user_id'] != $entity['user_id'] ){ //证明该文件夹不是本人所有,不能删除
                            
                             throw new \Exception('该合作者不能删除该文件夹！');
                            
                        } 
                        
                    }

                    
                    
                    
                    
                
                //$dir_creator = $entity['user_id'] ;//证明是自己创建的

                /* $save_data=[
                        'dir_father_id' =>$entity['dir_id'],
                        'user_id' => $entity['user_id'],
                        'company_id' => $entity['company_id'],
                        'create_time' => time(),

                ];

                $add_dir=Db::name('items_dir')->insertGetId($save_data);   */

    
            }else{

                throw new \Exception('传入的用户权限类型不正确！！');
            }


            //对文件夹进行删除文件夹操作

            $save_data=[
                 'id' => $entity['dir_id'], //需要删除的文件夹id
                
               // 'dir_father_id' =>$entity['dir_id'],
               // 'user_id' => $entity['user_id'],
              //  'user_id' =>  $dir_creator, //如果父级目录不是归自己所有，自己创建的目录归父级目录创建者所有 
                 'company_id' => $entity['company_id'],
              //  'dir_name' => $entity['dir_name'],
              //  'create_time' => time(),

            ];



          //  
            
         // $delete_dir =1;      

            //遍历子孙文件夹
            $get_find=[
                'company_id' =>$entity['company_id'],
                

            ];
            $temp_get_all_id= $this->get_all_dir_list($get_find); //获取所有目录
           
            //获取所有无限级的的id数组
            $all_delete_dir_id = $this-> get_share_array($temp_get_all_id['data'],$entity['dir_id']); 
            $all_delete_dir_id[]=$entity['dir_id'];//把当前目录id加上
            //echo "<pre>";
           // print_r($all_delete_dir_id);
           //$all_delete_dir_id=[93,94,95,96];
           // $a=[777,778];
            //exit;
            //邀请表删除文件夹
            $temp_dir=Db::name('invite_cooperator')
                    ->where('is_dir_items',1)//1是文件夹
                    ->where('invite_items_id','in',$all_delete_dir_id)
                    ->delete();
            if(!empty($temp_dir)){//有数据，文件夹数据被删除

            }else{//没有数据

            }

            //删除文件夹下所有的单个项目,items表
            $temp_items=Db::name('items')->where('items_dir_id','in',$all_delete_dir_id)->delete();
            if(!empty($temp_items)){//有数据，项目数据被删除

            }else{//没有数据

            }

            //去items_dir表中删除
            $delete_dir = Db::name('items_dir')->delete($all_delete_dir_id);
        

          /*  //去看看该父级目录下的分享情况,除去之前所有可以共享该目录的合作者
           $temp_find_invite=Db::name('invite_cooperator')
                                ->where('invite_items_id',$entity['dir_id'])//编辑的文件夹id,0就不需要关注了
                             //->where('invite_user_id',$entity['user_id']) //邀请的用户id
                                ->where('is_dir_items',1) //1是文件夹
                                //->where('edit_type','=','2' ) //2是可以编辑
                                ->field('id')
                                ->select();

            
           if(!empty( $temp_find_invite)){
                $delete_coop_id=array();   //删除邀请项目的文件夹id集合
                foreach($temp_find_invite as $v){
                    $delete_coop_id[] = $v['id'];//二维转一维
                }

                $temp_delete_coop=Db::name('invite_cooperator')->delete($delete_coop_id);
                if(empty( $temp_delete_coop)){ //失败删除邀请合作者管理的文件夹
                    throw new \Exception('邀请合作者管理的文件夹删除失败！！！');
               }
              
                $delete_dir=Db::name('items_dir')->delete($save_data); 
             

           }else{ //该文件夹没有邀请，直接删除
                $delete_dir=Db::name('items_dir')->delete($save_data); 
           } */



            if(!empty($delete_dir)){   //删除成功

               
               /// echo "<pre>";
               // print_r($temp_find_invite);
                
                $result['code'] = 200;
                $result['message'] = "文件夹删除成功";
                $result['data'] = [];
            }else{

                $result['code'] = 201;
                $result['message'] = "文件夹删除失败";
                $result['data'] = [];

            }
            
          

        



        }catch(\Exception $e){

            $result['code'] = 401;
            $result['message'] = $e->getMessage();
            $return['data']=[];
        }

        return $result;
    
    }



    //移动空间列表文件夹
    public function remove_multiple_dir($entity){
        //multiple 多个文件夹
      
       /* $test_data=[
          'user_type' =>1,
          'company_id' =>1,
          'user_id' =>5,
          'multiple_dir_id' => [94,95,96], //需要移动哪个文件夹的id
          //'move_to_dir_id' =>6,//移动到哪个文件夹下
        

      ]; 
      $entity=$test_data;  */
      

      if(empty($entity['multiple_dir_id'])){ 
          throw new \Exception('没有传入要移动的文件夹id，dir_id');
         
      }

      if(!isset($entity['move_to_dir_id'])){//不能empty(可能需要移动到首页)
        throw new \Exception('请设置要移动到哪个文件夹的id，move_to_dir_idcccccc');
      }

      

      try{

          if(intval($entity['user_type'])  === 1 || intval($entity['user_type'])  === 2){//管理员
              
              
                  
                  //先查找，看看数据库中是否还有该目录组
                  $find_multiple_dir = Db::name('items_dir')
                            ->where('id','in',$entity['multiple_dir_id'])
                            ->field('id')
                            ->select();
                  
                  if(empty($find_multiple_dir)){ //证明没有该文件夹
                      throw new \Exception('移动失败，需要移动的目录不存在！');
                      
                  }else{
                    $multiple_dir_id=array();
                    foreach($find_multiple_dir as $v){
                        $multiple_dir_id[]=$v['id'];
                    }
                  }
                 
                  
              
              


              
      
          }else if(intval($entity['user_type'])  === 3){//合作者
              //合作者需要判断编辑类型

             
                   //先查找，看看数据库中是否还有该目录组
                   $find_multiple_dir = Db::name('items_dir')
                                ->where('id','in',$entity['multiple_dir_id'])
                                ->where('user_id',$entity['user_id'])  //自己的项目
                                ->field('id')
                                ->select();
                  
                  if(empty($find_multiple_dir)){ //证明没该文件夹
                      throw new \Exception('合作者移动失败，需要移动的目录不存在或则权限有问题！');
                      
                  }else{ //有可以移动的文件夹
                    $multiple_dir_id=array();
                    foreach($find_multiple_dir as $v){
                        $multiple_dir_id[]=$v['id'];
                    }
                  }

  
          }else{

              throw new \Exception('传入的用户权限类型不正确！！');
          }


          //对文件夹进行移动文件夹操作

          $save_data=[
               
               'dir_father_id'=>$entity['move_to_dir_id'],
              
              // 'dir_father_id' =>$entity['dir_id'],
              // 'user_id' => $entity['user_id'],
              //  'user_id' =>  $dir_creator, //如果父级目录不是归自己所有，自己创建的目录归父级目录创建者所有 
               'company_id' => $entity['company_id'],
               'update_time' =>time(),
            //  'dir_name' => $entity['dir_name'],
            //  'create_time' => time(),

          ];

          $remove_dir = Db::name('items_dir')->where('id','in',$multiple_dir_id)->update($save_data);

          if(!empty($remove_dir)){   //移动成功

             
             /// echo "<pre>";
             // print_r($temp_find_invite);
              
              $result['code'] = 200;
              $result['message'] = "文件夹移动成功";
              $result['data'] = [];
          }else{

              $result['code'] = 201;
              $result['message'] = "文件夹移动失败";
              $result['data'] = [];

          }
          
        

      



      }catch(\Exception $e){

          $result['code'] = 401;
          $result['message'] = $e->getMessage();
          $return['data']=[];
      }

      return $result;
  
    }

    //移动空间列表文件(项目)
    public function remove_multiple_items($entity){
        //multiple 多个文件夹
      
      /*  $test_data=[
          'user_type' =>1,
          'company_id' =>1,
          'user_id' =>2,
          'multiple_items_id' => [2093,2094,2096], //需要移动哪个文件的id
          //'move_to_dir_id' =>6,//移动到哪个文件夹下
         

      ]; 
      $entity=$test_data;  */
      

      if(empty($entity['multiple_items_id'])){ 
          throw new \Exception('没有传入要移动的文件id，multiple_items_id');
         
      }

      if(!isset($entity['move_to_dir_id'])){//不能empty(可能需要移动到首页)
        throw new \Exception('请设置要移动到哪个文件夹的id，move_to_dir_id');
      }

      

      try{

          if(intval($entity['user_type'])  === 1 || intval($entity['user_type'])  === 2){//管理员
              
              
                  
                  //先查找，看看数据库中是否还有该项目
                  $find_multiple_items = Db::name('items')
                            ->where('id','in',$entity['multiple_items_id'])
                            ->field('id')
                            ->select();
                  
                  if(empty($find_multiple_items)){ //证明没有该文件
                      throw new \Exception('移动失败，需要移动的项目不存在！');
                      
                  }else{
                    $multiple_items_id=array();
                    foreach($find_multiple_items as $v){ //
                        $multiple_items_id[]=$v['id'];
                    }
                  }
                 
                  
              
              


              
      
          }else if(intval($entity['user_type'])  === 3){//合作者
              //合作者需要判断编辑类型

             
                   //先查找，看看数据库中是否还有该目录组
                   $find_multiple_items = Db::name('items')
                                ->where('id','in',$entity['multiple_items_id'])
                                ->where('user_id',$entity['user_id']) //属于自己的项目
                                ->field('id')
                                ->select();
                  
                  if(empty($find_multiple_items)){ //证明没该文件夹
                      throw new \Exception('合作者移动失败，需要移动的目录不存在或则权限有问题！');
                      
                  }else{ //有可以移动的文件夹
                    $multiple_items_id=array();
                    foreach($find_multiple_items as $v){
                        $multiple_items_id[]=$v['id'];
                    }
                  }

  
          }else{

              throw new \Exception('传入的用户权限类型不正确！！');
          }


          //对文件夹进行移动文件夹操作

          $save_data=[
               
               'items_dir_id'=>$entity['move_to_dir_id'],
              
              // 'dir_father_id' =>$entity['dir_id'],
              // 'user_id' => $entity['user_id'],
              //  'user_id' =>  $dir_creator, //如果父级目录不是归自己所有，自己创建的目录归父级目录创建者所有 
               'company_id' => $entity['company_id'],
               'update_time' =>time(),
            //  'dir_name' => $entity['dir_name'],
            //  'create_time' => time(),

          ];

          $remove_items = Db::name('items')->where('id','in',$multiple_items_id)->update($save_data);

          if(!empty($remove_items)){   //移动成功

             
             /// echo "<pre>";
             // print_r($temp_find_invite);
              
              $result['code'] = 200;
              $result['message'] = "文件移动成功";
              $result['data'] = [];
          }else{

              $result['code'] = 201;
              $result['message'] = "文件移动失败";
              $result['data'] = [];

          }
          
        

      



      }catch(\Exception $e){

          $result['code'] = 401;
          $result['message'] = $e->getMessage();
          $return['data']=[];
      }

      return $result;
  
    }

    //移动空间列表中多个文件夹与文件(项目)
    public  function remove_multiple_dir_items($entity){
        $test_data=[
            'user_type' =>1,
            'company_id' =>1,
            'user_id' =>2,
            'multiple_dir_id' => [94,95,96], //需要移动哪个文件的id,默认[]
            'multiple_items_id' => [2093,2094,2096], //需要移动哪个文件的id，默认[]
            //'move_to_dir_id' =>6,//移动到哪个文件夹下
            'move_to_dir_id' =>95,//移动到哪个文件夹下
  
        ]; 
        $entity=$test_data;
        //先查找看看有没有移动到哪个文件夹的id
        $find_move_to_dir_id = Db::name('items_dir')->where('id',$entity['move_to_dir_id'])->find();
        if(empty($find_move_to_dir_id)){
            throw new \Exception('移动到的文件夹不存在！ move_to_dir_id');
        }

        if(empty($entity['company_id'])){
            throw new \Exception('没有传入公司id');
        }
        if(empty($entity['user_id'])){
            throw new \Exception('没有传入用户id');
        }
  
        if(empty($entity['multiple_dir_id']) && empty($entity['multiple_items_id'])){  
            throw new \Exception('没有传入要移动的文件夹或项目id，dir_id');
           
        }
  
        if(!isset($entity['move_to_dir_id'])){//不能empty(可能需要移动到首页)
          throw new \Exception('请设置要移动到哪个文件夹的id，move_to_dir_idvvv');
        }


        if(!empty($entity['multiple_dir_id'])){ //去移动文件夹的所属目录
           // $get_remove_items = $this->remove_multiple_items($entity);
            $get_remove_dir = $this->remove_multiple_dir($entity);
           
          
        }else{
            $get_remove_dir =[
                'data'=>[],
                'message'=>'没有文件夹修改！！',
                'code'=>200
            ];
            

        }

        if(!empty($entity['multiple_items_id'])){ //去移动文件(项目)的所属目录
            $get_remove_items = $this->remove_multiple_items($entity);
            // $get_remove_dir = $this->remove_multiple_dir($entity);
          
        }else{
            $get_remove_items =[
                'data'=>[],
                'message'=>'没有文件修改！！',
                'code'=>200
            ];
            $result['data']['remove_dir']['message'] ='';
        }

        if($get_remove_items['code']==200 && $get_remove_dir['code'] == 200){ //两个成功没有异常

            $result['data']['remove_dir']=$get_remove_dir;
            $result['data']['remove_items']=$get_remove_items;
            $result['message']='移动成功！';
            $result['code'] = 200;
        }else{
            $result['data']['remove_dir']=$get_remove_dir;
            $result['data']['remove_items']=$get_remove_items;
            $result['message']='出现异常！';
            $result['code'] = 201;
              
        }


        return $result;
        
    }




    //管理员分享文件夹给合作者
    public function invite_dir_items($entity){

        $test_data=[
            'user_type' =>1,
            'company_id' =>1,
            'user_id' =>2,
           
            'edit_type'=>1, //1查看，2编辑
            'invite_items_id' =>95,//邀请的项目或文件夹id
            'is_dir_items'=> 1,//1是文件夹，2是单个文件(项目)
  
        ]; 
        $entity=$test_data;

        

        if(intval($entity['user_type'])  === 1 || intval($entity['user_type'])  === 2){//管理员

            if(empty($entity['company_id'])){
                throw new \Exception('没有传入公司id');
            }
            if(empty($entity['user_id'])){
                throw new \Exception('没有传入用户id');
            }

            if(empty($entity['invite_items_id'])){   //没有传入需要分享的目录或文件
                throw new \Exception('没有传入要邀请的文件夹或项目id，invite_items_id');
            
            }

            if(empty($entity['is_dir_items'])){   //没有传入需要分享的目录或文件
                throw new \Exception('没有传入要邀请的文件夹或项目类型，is_dir_items');
                
            }else if($entity['is_dir_items'] == 1){ //操作文件夹


                $find_invite_dir_id = Db::name('items_dir')->where('id',$entity['invite_items_id'])->find();
                if(empty($find_move_to_dir_id)){
                        throw new \Exception('邀请的文件夹不存在！ move_to_dir_id');
                }else{
                    //获取所有目录
                    $get_all_dir_list=$this->get_all_dir_list($entity);
                    /* if(){

                    } */
                    exit;

                }




            }else if($entity['is_dir_items'] == 2){ //操作文件（项目）







            }else{
                throw new \Exception('入要邀请的文件夹或项目类型不对，is_dir_items');
            }
                /* if(){

                }else */
            


            /* 
              if(){

              }else if(){

              }else{
                throw new \Exception('移动到的文件夹不存在！ move_to_dir_id');
              } */
              
            //先查找看看有没有该分享文件夹的id
            

            /* if(empty($entity['company_id'])){
                throw new \Exception('没有传入公司id');
            }
            if(empty($entity['user_id'])){
                throw new \Exception('没有传入用户id');
            }
    
            if(empty($entity['multiple_dir_id']) && empty($entity['multiple_items_id'])){  
                throw new \Exception('没有传入要移动的文件夹或项目id，dir_id');
            
            } */
           
            
        
        


        

        }else if(intval($entity['user_type'])  === 3){//合作者
            throw new \Exception("合作者没有邀请权限！");
        }else{
            throw new \Exception("管理权限异常！");
        }
        
        
  
        

        try{

        }catch(\Exception $e){

        }
        return $result;
    }






    //获取无限级，一维数组，删除文件夹中使用，delete_dir()
    public function get_share_array($data,$pid=0,$SonNode = array()){
        //$SonNode[] = $pid;
       // $SonNode = array();

        foreach($data as $k=>$v){
    
            if($v['dir_father_id'] == $pid){
    
                $SonNode =$this-> get_share_array($data,$v['id'],$SonNode);              
                //$SonNode[]=$v;
                $SonNode[]=$v['id'];
            }
            
    
        }
    
        return $SonNode;   //返回新数组
    }





   




}