<template>
    <div style="margin: 0">
        <el-container style="height: 100%;width: 100%">
            <el-header style="width: 100%" class="el-header">
                <div style="display:flex; width: 100%; height:60px; background-color: #000000; line-height: 60px; border-bottom: 1px solid #ffffff">
                    <div style="width: 400px; display:flex;">
                        <div style="flex: 1; margin-left: 10px ; ">
                            <el-link href="/home" type="primary" style="font-size:x-large ; font-family: Arial;color: #ffffff">
                                Gravity &nbsp; Lens &nbsp; Modeling
                            </el-link>
                        </div>
                    </div>
                    <div style="flex: 1">
                        <el-menu
                                :default-active="activeIdx"
                                class="el-menu-demo"
                                mode="horizontal"
                                router
                                background-color="#000000"
                                text-color="#ffffff"
                                active-text-color="#ffd04b">

                            <el-menu-item index="hoopla" >
                                <i class="el-icon-camera-solid"></i>
                                <span slot="title">Hoopla</span>
                            </el-menu-item>
                            <el-menu-item index="introduction" >
                                <i class="el-icon-document"></i>
                                <span slot="title">Introduction</span>
                            </el-menu-item>
                            <el-menu-item index="citizenScience">
                                <i class="el-icon-eleme"></i>
                                <span slot="title">Citizen Science</span>
                            </el-menu-item>
                            <el-menu-item index="instruction" >
                                <i class="el-icon-s-management"></i>
                                <span slot="title">Instruction</span>
                            </el-menu-item>
                            <el-menu-item  index="teamAndTouch">
                                <i class="el-icon-phone"></i>
                                <span slot="title">Team & Touch</span>
                            </el-menu-item>
                        </el-menu>
                    </div>
                </div>
            </el-header>

            <el-main>
                <router-view/>
            </el-main>

            <el-footer>
                footer
            </el-footer>
        </el-container>

    </div>

</template>

<script>
    export default {
        name: "Frame",
        data() {
            return{
                activeIdx: '1'
            }
        },
    }

</script>

<style >
    .el-header {
        margin: 0 0;
        padding: 0 0;
        flex-shrink: 0;
        width: 100%;
    }
    html,body{
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
    }
</style>
