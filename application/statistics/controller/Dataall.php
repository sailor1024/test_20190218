<?php
namespace app\statistics\controller;

use app\index2\controller\Base;
use think\cache\driver\File;
use app\common\Token;
use think\Db;

class Dataall extends Base
{

    /**
     * 数据统计的总入口函数
     * @return false|string
     * @author tanhuaxin
     */
    public function get_selete_data()
    {
        //https://todo.kangyun3d.cn/index.php/statistics/dataall/get_selete_data?items_dirname=641b3ad9547fbd821d764372e150c7ac&get_method_arr=Comment_praiseWeekStatistics,Comment_get_week_comment,Data_active_users_VisitorInterest,Data_history_VisitsSummary_getVisits,Data_all_VisitsSummary_get
        $entity = input('param.');
        $get_method_arr = input('param.get_method_arr');
        $get_method_type = input('get_method_type');
        if (!$get_method_type) {
            return json_return(1, '请添加get_method_type');
        }

        $res = $this->checkGetDataType($entity);
        if ($res['msg']) {
            return json_return(1, $res['msg']);
        } else {
            $cacheIndex = 'statistics_' . $get_method_type . '_' . $entity['get_data_type'] . '_'; //缓存 文件名
            if ($entity['get_data_type'] == 'company') {
                $cacheIndex .= $res['data']['company_id'];
            } else if ($entity['get_data_type'] == 'user') {
                $cacheIndex .= $res['data']['user_id'];
            } else {
                $where['dirname'] = $entity['items_dirname'];
                $cacheIndex .= $entity['items_dirname'];
            }

            //获取缓存
            $get_cache_data = cache($cacheIndex);
            if ($get_cache_data) { //有数据
                $get_data = json_decode($get_cache_data, true);
            } else {
                $get_data = array();
                $get_method_arr = str_replace(array('[', ']', '"', "'", " "), '', $get_method_arr);
                $method_arr_2 = explode(',', $get_method_arr); //将字符串转数组
                $getClassName = [];
                foreach ($method_arr_2 as $k => $v) {
                    $get_class_value = strstr($v, '_', true); //没有下划线将返回false ,有将返回第一个_ 的前段部分
                    if ($get_class_value !== false && !empty($get_class_value)) {
                        if (!isset($getClassName[$get_class_value])) { //之前没有该类的创建
                            $getClassName[$get_class_value] = $get_class_value;
                            $new_Object = "\app\statistics\controller\\" . $get_class_value; //引进类
                            if (class_exists($new_Object)) { //判断是否有类
                                $obj[$get_class_value] = new $new_Object;
                            } else {
                                return json_return(1, '类 ' . $v . '不存在'); //没有类
                            }
                        }

                        //获取方法
                        $get_method_value = strstr($v, '_'); // 将 Comment_get_week_comment 截取出  _get_week_comment
                        if (!empty($get_method_value) && strlen($get_method_value) > 1) {
                            $new_method_str = substr($get_method_value, 1); // 从下标为1的字符串开始截取至最后,主要是为了截取去掉 '_'
                            if (method_exists($obj[$get_class_value], $new_method_str)) { //判断方法是否存在
                                $get_data[$v] = call_user_func(array($obj[$get_class_value], $new_method_str)); //定义类和方法
                            } else {
                                return json_return(1, '方法 ' . $v . '不存在');//其实是该类中没有方法   $new_method_str
                            }
                        }
                    }
                }
                //缓存数据
                cache($cacheIndex, json_encode($get_data), 300); //暂时缓存5分钟
            }
            return json_return(200, 'success', $get_data);
        }
    }
}