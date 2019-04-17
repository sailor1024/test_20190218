<?php
/**
 * Created by PhpStorm.
 * User: NickDeng
 * Date: 2018/11/16
 * Time: 20:51
 */

namespace app\index2\controller;

use app\index2\model\StatisticsView;
use app\index2\model\StatisticsViewCount;
use app\index2\model\StatisticsUserIpDevice;
use app\index2\model\InviteCooperator;
use app\index2\model\Items;
use think\Db;
use app\common\Token;

class Statistics extends Base {
    /**新增访问
     * @param StatisticsView $statisticsView
     * @return \think\response\Json
     */
    public function addvisit(StatisticsView $statisticsView, Items $items, StatisticsUserIpDevice $statisticsUserIpDevice) {
        $params = input('param.');
//        if (empty($params) || !is_array($params) || empty($params['device'])) {
//            return json(['code' => 400, 'data' => [], 'message' => lang('param miss')]);
//        }
        $statisticAddOne = [];
        //增加记录表记录一条
        if ($params['items_id'] == '' && $params['device'] != 1 && $params['dir_name'] != '') {
            //普通外部浏览，需要增加浏览量，判断是否增加特殊用户
            $itemsId = $items->getArr(['where' => ['dirname' => $params['dir_name']]]);

            if ($itemsId['info'] == null) {
                $this->json_msg(['message' => lang('unknown mistake')]);
            }
            //声明记录
            $statisticAddOne = ['type' => 1, 'items_id' => $itemsId['info']->id];
            $userInfo['ip'] = real_ip();
            $userInfo['device'] = $params['device'];
            $userInfo['items_id'] = $itemsId['info']->id;
            //检查是否符合新增特殊用户
            $res = $statisticsUserIpDevice->checkUser($userInfo);
//            halt($res);
            if ($res == 401) {//符合条件，但是新增失败
                $this->json_msg(['message' => lang('insert database fault')]);
            } elseif ($res == 200) {
                //单纯重复访问
            } else {
                //特殊访客出现
                $typeData = [
                    ['type' => 3, 'items_id' => $itemsId['info']->id],
                    ['type' => 1, 'items_id' => $itemsId['info']->id]
                ];
                //同时新增特殊访客和普通浏览
                $res_view = $statisticsView->saveTwoType($typeData);

                if ($res_view !== 200) {
                    return json(['code' => 500, 'data' => [], 'message' => lang('insert database fault')]);
                }
                $this->json_msg(['code' => 200]);
            }

        } elseif ($params['items_id'] != '' && $params['dir_name'] == '' && $params['device'] = 1 && $params['user_id'] != '') {
            //注册用户访问，需要增加访问量

            $statisticAddOne = ['type' => 2, 'items_id' => $params['items_id'], 'user_id' => $params['user_id']];
        } else {//传参不符合要求
            $this->json_msg(['message' => lang('param miss')]);
        }

        //根据上方判断新增单纯普通浏览或者普通访问
        $res_view = $statisticsView->add($statisticAddOne);
        if ($res_view['code'] !== 200) {
            return json(['code' => 500, 'data' => [], 'message' => lang('insert database fault')]);
        }
        $this->json_msg($res_view);
//        $res_view_total = $viewModel->count($params);
        //累加相关count表
//        $countModel = new StatisticsViewCount;
    }

    /**
     * 获取访问
     * @param StatisticsView $statisticsView
     * @param InviteCooperator $inviteCooperator
     * @param Items $items
     * @return \think\response\Json
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function visitlist(StatisticsView $statisticsView, InviteCooperator $inviteCooperator, Items $items) {
        $params = input('param.');

        if ($params['time_horizon'] < 7 || $params['page'] < 1 || $params['sort_type'] < 1) {
            return json(['code' => 400, 'data' => [], 'message' => lang('param miss')]);
        }
        //浏览器测试导出Excel
//        $params['page']=1;
//        $params['time_horizon'] = 7;
//        $params['is_excel'] = 1;
        //每页数量暂时写死
        $params['limit_num'] = 10;
        $entity = Token::getUserGreps(['key_name' => $params['_']]);
//        $entity['user_id'] = 70;
//        $entity['user_type'] = 3;
//        $entity['company_id'] = 1;
        //合作者没有任何邀请的数量统计容器
        $spCount = -1;
        $sortForSql = [1 => 'title', 2 => 'create_time'];
        if ($entity['user_type'] == 3) {
            //走合作者流程，需要取自己创建项目和被邀请的项目
            $invWhere = [
                'where' => ['invite_user_id' => $entity['user_id']],
                'field' => ['items_dir_id', 'items_id', 'edit_type']
            ];
            // 取合作的项目文件id&项目id
            $whichInvs = $inviteCooperator->getList($invWhere);
            if (count($whichInvs['info']) == 0) {
                //如果合作者用户没有任何的邀请
                $statisticsGetUserAllCount = [
                    'where' => ['user_id' => $entity['user_id'], 'valid' => 1],
                    'order' => $sortForSql[$params['sort_type']] . ' desc',
                    'page' => $params['page'],
                    'limit_num' => $params['limit_num']
                ];
                $statisticsGetUserAllCountArray = $items->getList($statisticsGetUserAllCount);
                //TODO!合作者名下无邀请，排除分页的访问和浏览总量
                $forTwoCount = [
                    'in' => 1,
                    'where' => 'user_id',
                    'eq' => $entity['user_id'],
                    'time' => $params['time_horizon']
                ];
                $twoTypeCount = $statisticsView->twoTypeCount($forTwoCount);

                if ($statisticsGetUserAllCountArray['code'] === 401) {
                    $a = ['message' => lang('got nothing')];
                    $this->json_msg($a);
                }
                $countNum = count($statisticsGetUserAllCountArray['info']->total());
                $itemsRaw = $statisticsGetUserAllCountArray['info'];
                $spCount = $countNum;
            } else {
                // 有权限项目、名下所有项目，分别准备查询条件
                $invs = ['items_id' => [], 'items_dir_id' => []];
                $invsForCount = ['items_id' => [], 'items_dir_id' => []];
                // 去零数据,拿总数筛选条件
                foreach ($whichInvs['info'] as $k => $v) {
                    if ($v['items_dir_id'] == 0) {//邀请全是否为文件夹
                        if ($v['edit_type'] == 2) {//是否有编辑权限
                            $invs['items_id'][] = $v['items_id'];
                        }
                        $invsForCount['items_id'][] = $v['items_id'];
                    } else {
                        if ($v['edit_type'] == 2) {
                            $invs['items_dir_id'][] = $v['items_dir_id'];
                        }
                        $invsForCount['items_dir_id'][] = $v['items_dir_id'];
                    }
                }
                //去重
                $invsForCount['items_id'] = array_unique($invsForCount['items_id']);
                $invsForCount['items_dir_id'] = array_unique($invsForCount['items_dir_id']);
                $invs['items_id'] = array_unique($invsForCount['items_id']);
                $invs['items_dir_id'] = array_unique($invsForCount['items_dir_id']);
                //取到此账号下所有项目总数
                $countNum = $items->statisticsCountAllItemsNum($invsForCount, $entity['user_id']);
                if ($countNum === 0) {
                    $a = ['message' => lang('got nothing')];
                    $this->json_msg($a);
                }
                // 在item表通过创建者id，项目自身id,项目文件id，拉取项目,或根据字段拉取导出Excel所需数据
                $itemsRaw = $items->statisticsGetItems($invs, $entity['user_id'], $params['is_excel'], $params['page'], $params['limit_num'], $sortForSql[$params['sort_type']]);
                //TODO!合作者有被邀请的项目，获得不分页的访问和浏览
                $forTwoCount = [
                    'in' => 2,
                    'items_id' => $invsForCount['items_id'],
                    'items_dir_id' => $invsForCount['items_dir_id'],
                    'user_id' => $entity['user_id'],
                    'time' =>$params['time_horizon']
                ];
                $twoTypeCount = $statisticsView->twoTypeCount($forTwoCount);
                if (count($itemsRaw) === 0) {//查询项目表一无所获。。。
                    $this->json_msg(['data' => ['list' => '', 'total' => '', 'count_total' => $countNum, 'type_1_total' => '', 'type_2_total' => '']]);
                }
            }
        } else {
            //走管理员流程
            //去公司id下的所有项目
            if ($params['is_excel'] == 1) {//如果需要导出，则拉去全部项目
                $whichItems = [
                    'where' => ['company_id' => $entity['company_id']],
                    'order' => $sortForSql[$params['sort_type']] . ' desc',
                ];
            } else {
                $whichItems = [
                    'where' => ['company_id' => $entity['company_id']],
                    'order' => $sortForSql[$params['sort_type']] . ' desc',
                    'page' => $params['page'],
                    'limit_num' => $params['limit_num']
                ];
            }
            $itemsRaw = $items->getList($whichItems);
            //TODO!管理员名下非分页的访问和浏览总数
            $forTwoCount = [
                'in' => 1,
                'where' => 'company_id',
                'eq' => $entity['company_id'],
                'time' =>$params['time_horizon']
            ];

            $twoTypeCount = $statisticsView->twoTypeCount($forTwoCount);
            if (count($itemsRaw['info']) == 0 || $itemsRaw['code'] === 401) {
                $a = ['message' => lang('got nothing')];
                $this->json_msg($a);
            }
            $countNumInfo = $items->getList([
                'where' => ['company_id' => $entity['company_id']],
                'field' => 'id'
            ]);
            //账号名下所有项目
            $countNum = count($countNumInfo['info']);
        }
        //获取项目id，获取登录信息全表，比对id赋值给对应的项目
        $itemsIdList = [];
        $forName = [];
        $itemsList = [];

        if (array_key_exists('info', $itemsRaw)) {
            $itemsRaw = $itemsRaw['info'];
        }
        //账号名下有权限的项目数量
        if ($params['is_excel'] != 1) {//导出Excel不使用分页，没有total()
            if ($spCount == -1) {
                $countEdit = $itemsRaw->total();
            } else {
                $countEdit = $spCount;
            }
        }
//        halt( $itemsRaw->total());

        foreach ($itemsRaw as $k => $v) {
            $forName[$k]['items_id'] = $itemsIdList[] = $v['id'];
            $itemsList[$k] = $v;
            $forName[$k]['user_id'] = $v['user_id'];
        }
        //放入用户名
//        halt($forName);
        $userNames = getNames($forName);
        foreach ($itemsList as $ik => &$iv) {
            foreach ($userNames as $k => $v) {
                if ($v['items_id'] == $iv['id']) {
                    $iv['first_name'] = $v['first_name'];
                    $iv['last_name'] = $v['last_name'];
                }
            }
            $iv['type_1'] = 0;
            $iv['type_2'] = 0;
            $iv['type_3'] = 0;
        }

        //拉取统计访问数量
        $typeDataRaw = $statisticsView->count_all($itemsIdList, $params['time_horizon']);
//        halt($typeDataRaw);
        //将访问数装入

        foreach ($itemsList as $k => &$v) {
            foreach ($typeDataRaw as $tk => $tv) {
                if ($tk == $v['id']) {
                    $v['type_1'] = $tv[1];
                    $v['type_2'] = $tv[2];
                    $v['type_3'] = $tv[3];
                }
            }
//
        }


//        halt($itemsList[0]);
//        foreach ($itemsList as $k => &$v) {
//          $v['type_1'] = $typeData[$v['id']]['type_1'];
//          $v['type_2'] = $typeData[$v['id']]['type_2'];
//          $v['type_3'] = $typeData[$v['id']]['type_3'];
//        }
        $typeOneCount = $twoTypeCount['typeOneCount'];
        $typeTwoCount = $twoTypeCount['typeTwoCount'];

        foreach ($itemsList as $k => &$v) {
            //计算项目存在时间
            $v['days'] = computeDaysTillNow((int)$v['create_time'] / 1000);
            //累计两种访问数量
//            $typeOneCount += $v['type_1'];
//            $typeTwoCount += $v['type_2'];
        }
//        foreach ($itemsList as $k => &$v){
//            $v['create_time'] = (int)($v['create_time'] . '000');
//        }
        if ($params['is_excel'] != 1) {
            //根据时间、title排序
//            $items->sortlist($itemsList, $params['sort_type']);
            $res = ['data' => ['list' => $itemsList, 'total' => $countEdit, 'count_total' => $countNum, 'type_1_total' => $typeOneCount, 'type_2_total' => $typeTwoCount]];
            $this->json_msg($res);
        } else {
            $this->excel($itemsList, $entity['user_id'], $typeOneCount, $typeTwoCount, $countNum);
        }
    }


    /**
     * 批量生成假数据用
     * @throws \Exception
     */
    public function insertfake()
    {
        for ($i = 1; $i < 100; $i++) {
            StatisticsView::create([
                'user_id' => 1,
                'type' => random_int(1, 3),
                'items_id' => 2071,
//                'create_time'=>time()
            ]);
//            Db::name('statistics_view_type')->insert([
//                'user_id' => 1,
//                'type' => random_int(1, 3),
//                'items_id' => 2001,
//                'create_time'=>time()]);
        }
    }

    /**
     * 辅助导出
     * @param $value
     * @return string
     */
    public static function setChar($value) {
        return iconv('UTF-8', 'GBK//IGNORE', $value);//转化编码
    }

    /*导出数据excel*/
    public function excel($res, $userId, $typeOneCount, $typeTwoCount, $count) {
        header('Content-Type: text/html; charset=utf8;');
        header("Content-type:application/vnd.ms-excel");//指定文件类型
//        $userid = input('param.userid');
//        $type = input('param.type');
//        $register_phone = input('param.phone');//登录者手机号
//        $name = input('param.name');
        header("Content-Disposition:attachment;filename={$userId}.xls");
//        $res = $this->count_project_metch($userid, $type, $register_phone);
        //页面输出一般是不需要转码的，excel输出才需要转码
        echo '<table width=500 height=25 border=0 align=center cellpadding=0 cellspacing=0>';
        echo '<thead><tr>';
        echo '<thead><tr>';    //设置thead输出
        echo '<td style="border:1px solid black;padding:10px;text-align:center;">' . $this->setChar('项目总数') . '</td>';
        echo '<td style="border:1px solid black;padding:10px;text-align:center;">' . $this->setChar('浏览总数') . '</td>';
        echo '<td style="border:1px solid black;padding:10px;text-align:center;">' . $this->setChar('访问总数') . '</td>';
        echo '</thead></tr>';
        echo '<tbody>';
        echo '<td style="border:1px solid black;padding:10px;text-align:center;">' . $this->setChar($count) . '</td>';
        echo '<td style="border:1px solid black;padding:10px;text-align:center;">' . $this->setChar($typeOneCount) . '</td>';
        echo '<td style="border:1px solid black;padding:10px;text-align:center;">' . $this->setChar($typeTwoCount) . '</td>';
        echo '</tbody></table>';
        echo '<table width=500 height=25 border=0 align=center cellpadding=0 cellspacing=0>';
        echo '<thead><tr>';    //设置thead输出
        echo '<td style="border:1px solid black;padding:10px;text-align:center;">' . $this->setChar('编号') . '</td>';
        echo '<td style="border:1px solid black;padding:10px;text-align:center;">' . $this->setChar('项目名称') . '</td>';
        echo '<td style="border:1px solid black;padding:10px;text-align:center;">' . $this->setChar('创建人姓名') . '</td>';
        echo '<td style="border:1px solid black;padding:10px;text-align:center;">' . $this->setChar('天数') . '</td>';
        echo '<td style="border:1px solid black;padding:10px;text-align:center;">' . $this->setChar('浏览') . '</td>';
        echo '<td style="border:1px solid black;padding:10px;text-align:center;">' . $this->setChar('访问') . '</td>';
        echo '<td style="border:1px solid black;padding:10px;text-align:center;">' . $this->setChar('特殊访客') . '</td>';
        echo '<td style="border:1px solid black;padding:10px;text-align:center;">' . $this->setChar('URL') . '</td>';
        echo '</thead></tr>';
        echo '<tbody>';    //设置tbody输出
        foreach ($res as $k => $v) {
            echo '<tr>';
            echo '<td style="border:1px solid black;padding:10px;text-align:center;">' . $this->setChar($k) . '</td>';
            echo '<td style="border:1px solid black;padding:10px;text-align:center;">' . $this->setChar($v['title']) . '</td>';
            echo '<td style="border:1px solid black;padding:10px;text-align:center;">' . $this->setChar($v['last_name']) . $this->setChar($v['first_name']) . '</td>';
            echo '<td style="border:1px solid black;padding:10px;text-align:center;">' . $this->setChar($v['days']) . '</td>';
            echo '<td style="border:1px solid black;padding:10px;text-align:center;">' . $this->setChar($v['type_1']) . '</td>';
            echo '<td style="border:1px solid black;padding:10px;text-align:center;">' . $this->setChar($v['type_2']) . '</td>';
            echo '<td style="border:1px solid black;padding:10px;text-align:center;">' . $this->setChar($v['type_3']) . '</td>';
            echo '<td style="border:1px solid black;padding:10px;text-align:center;">' . $this->setChar($_SERVER['SERVER_NAME']) . '/' . $this->setChar($v['url']) . '</td>';
            echo '</tr>';
        }
        echo '</tbody></table>';
    }

    public function singleitem(StatisticsView $statisticsView) {
        $itemsId = input('param.items_id');

        if ($itemsId == '') {
            $this->json_msg(['code' => 400, 'data' => [], 'message' => lang('param miss')]);
        }

        $typeCount = $statisticsView->countOne($itemsId);
        $this->json_msg(['data' => $typeCount]);
    }
//    public function getNames($param)
//    {
//        foreach ($param as $k => $v) {
//            $where[] = $v['user_id'];
//        }
//        $nameRaw = Db::table('user')->where('id', 'in', $where)->field('id,firstname,lastname')->select();
//        foreach ($param as $pk => &$pv) {
//            foreach ($nameRaw as $k => $v) {
//                if ($pv['user_id'] == $v['id']) {
//                    $pv['first_name'] = $v['firstname'];
//                    $pv['last_name'] = $v['lastname'];
//                }
//            }
//        }
//        return $param;
//    }

    public function APItext() {
        $sql = "`id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键自增id',
  `path` varchar(100) DEFAULT '',
  `company_id` int(11) NOT NULL DEFAULT '0' COMMENT '所属公司id（company表）',";
        $a1 = explode(',', $sql);
        foreach ($a1 as $k => $v) {
            $column[] = explode('`', $v);
            $comment[] = explode("'", $v);
        }
        halt($column);

    }
}