<template>
	<view class="container">
		<!-- 搜索筛选区域 -->
		<view class="filter-container">
			<uni-search-bar @confirm="handleSearch" placeholder="输入宠物名字" />
			<uni-segmented-control :current="currentPetType" :values="petTypeOptions.map(item => item.text)"
				@clickItem="handleStatusChange" style-type="button" active-color="#007AFF" />
		</view>

		<!-- 列表 -->
		<view class="item-list" v-if="itemList.length > 0">
			<view class="item" v-for="item in itemList" :key="item.id">
				<view class="item-header" @click="showDetail(item)">
					<view class="pet-image-box">
						<img class="pet-image"
							:src="item.avatarUrl ? item.avatarUrl : item.petType === 'dog' ? dogIcon : catIcon">
					</view>
				</view>
				<view class="item-content" @click="showDetail(item)">
					<view class="item-info">
						<view class=" info-item">
							<text class="label">用户:</text>
							<text class="value">{{item.name}}</text>
						</view>
						<view class="info-item" v-if="item.age">
							<text class="label">年龄:</text>
							<text class="value">{{item.age}}岁</text>
						</view>
						<view class="info-item" v-if="item.petType">
							<text class="label">类型:</text>
							<text class="value">{{item.petType === 'dog' ? '🐶 狗狗' : '🐱 猫咪'}}</text>
						</view>
						<view class="info-item" v-if="item.gender">
							<text class="label">性别:</text>
							<text class="value">{{item.gender === 'female' ? '女生' : '男生'}}</text>
						</view>
						<view class="info-item" v-if="item.bodySize">
							<text class="label">体型:</text>
							<text
								class="value">{{item.bodySize === 'large' ? '大型犬（20kg以上）' : item.bodySize === 'medium' ? '中型犬（10kg-20kg）' : '小型犬（10kg以下）'}}</text>
						</view>
						<view class="info-item" v-if="item.breed">
							<text class="label">品种:</text>
							<text class="value">{{item.breed}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view class="empty-state" v-else>
			<uni-icons type="info" size="50" color="#ccc"></uni-icons>
			<text class="empty-text">暂无宠物数据</text>
		</view>

		<!-- 分页 -->
		<uni-pagination :total="total" :current="pagination.current" :pageSize="pagination.pageSize"
			@change="handlePageChange" showIcon />

		<uni-popup ref="detailPopup" type="dialog">
			<view class="detail-popup">
				<view class="detail-header">
					<text class="detail-title">宠物档案</text>
					<uni-icons type="close" size="20" @click="$refs.detailPopup.close()"></uni-icons>
				</view>
				<view class="detail-content">
					<view class="pet-image-box">
						<img class="pet-image"
							:src="petItem.avatarUrl ? petItem.avatarUrl : petItem.petType === 'dog' ? dogIcon : catIcon">
					</view>
					<view class="detail-item" v-if="petItem.name">
						<text class="detail-label">名字:</text>
						<text class="detail-value">{{petItem.name}}</text>
					</view>
					<view class="detail-item" v-if="petItem.age">
						<text class="detail-label">年龄:</text>
						<text class="detail-value">{{petItem.age}}岁</text>
					</view>
					<view class="detail-item" v-if="petItem.petType">
						<text class="detail-label">类型:</text>
						<text class="detail-value">{{petItem.petType === 'dog' ? '🐶 狗狗' : '🐱 猫咪'}}</text>
					</view>
					<view class="detail-item" v-if="petItem.gender">
						<text class="detail-label">性别:</text>
						<text class="detail-value">{{petItem.gender === 'female' ? '女生' : '男生'}}</text>
					</view>
					<view class="detail-item" v-if="petItem.bodySize">
						<text class="detail-label">体型:</text>
						<text
							class="detail-value">{{petItem.bodySize === 'large' ? '大型犬（20kg以上）' : petItem.bodySize === 'medium' ? '中型犬（10kg-20kg）' : '小型犬（10kg以下）'}}</text>
					</view>
				</view>

				<view class="detail-header">
					<text class="detail-title">主人信息</text>
				</view>
				<view class="detail-content">
					<view class="pet-image-box">
						<img class="pet-image" :src="userItem.profilePath ? userItem.profilePath : avatarUrl">
					</view>
					<view class="detail-item" v-if="addressItem.userName">
						<text class="detail-label">主人:</text>
						<text class="detail-value">{{addressItem.userName}}</text>
					</view>
					<view class="detail-item" v-if="addressItem.phone">
						<text class="detail-label">电话:</text>
						<text class="detail-value">{{addressItem.phone}}</text>
					</view>
					<view class="detail-item" v-if="addressItem.address && addressItem.address != '0'">
						<text class="detail-label">地址:</text>
						<text class="detail-value">{{addressItem.address}}</text>
					</view>
					<view class="detail-item" v-if="addressItem.addressNo && addressItem.addressNo != '0'">
						<text class="detail-label">门牌号:</text>
						<text class="detail-value">{{addressItem.addressNo}}</text>
					</view>
				</view>

			</view>

		</uni-popup>

	</view>

</template>

<script>
	import {
		getPets
	} from '@/api/pet/pet'
	import {
		getUser
	} from '@/api/user/user'
	import {
		getAddressByUserId
	} from '@/api/address/address'


	export default {
		data() {
			return {
				dogIcon: '/static/images/pet/default_dog.png',
				catIcon: '/static/images/pet/default_cat.png',
				avatarUrl: '/static/images/user/avatar.png',
				itemList: [],
				total: 0,
				pagination: {
					current: 1,
					pageSize: 10
				},
				addressItem: {},
				userItem: {},
				petItem: {},
				searchKey: '',
				loading: false,
				currentPetType: 0,
				petTypeOptions: [{
						text: '全部',
						value: 0
					},
					{
						text: '狗狗',
						value: 1
					},
					{
						text: '猫咪',
						value: 2
					}
				],
				petTypesMap: {
					0: 'all',
					1: 'dog',
					2: 'cat'
				},
			}
		},

		// 添加onLoad生命周期钩子
		onLoad() {
			this.loadPets()
		},

		methods: {
			async loadPets() {
				try {
					this.loading = true
					const params = {
						page: this.pagination.current,
						pageSize: this.pagination.pageSize,
						petType: this.petTypesMap[this.currentPetType],
						keyword: this.searchKey
					}

					const res = await getPets(params)
					this.itemList = res.data.list
					this.total = res.data.total
				} catch (error) {
					uni.showToast({
						title: '加载失败',
						icon: 'none'
					})
				} finally {
					this.loading = false
				}
			},

			async handleStatusChange(event) {
				// 获取当前选中的状态索引
				this.currentPetType = event.currentIndex
				// 重置分页到第一页
				this.pagination.current = 1
				// 重新加载订单数据
				this.loadPets()
			},

			// 添加搜索处理方法
			handleSearch(e) {
				// 获取搜索关键词
				this.searchKey = e.value
				// 重置分页到第一页
				this.pagination.current = 1
				// 重新加载订单数据
				this.loadPets()
			},

			// 添加分页处理方法
			handlePageChange(e) {
				this.pagination.current = e.current
				this.loadPets()
			},

			async showDetail(item) {
				this.petItem = {
					...item
				}

				try {
					const res = await getUser(item.userId)
					if (res && res.code === 200) {

						this.userItem = {
							...res.data
						}
					}

					const res2 = await getAddressByUserId(item.userId)
					if (res2 && res2.code === 200) {

						this.addressItem = {
							...res2.data
						}
					}

				} catch (error) {}

				this.$refs.detailPopup.open()
			}
		},

	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 20rpx;
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	.filter-container {
		margin-bottom: 20rpx;
		background: #fff;
		padding: 20rpx;
		border-radius: 12rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.item-list {
		margin-bottom: 20rpx;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 100rpx 0;
	}

	.empty-text {
		margin-top: 20rpx;
		color: #999;
	}

	.uni-pagination {
		margin-top: 30rpx;
		justify-content: center;
	}

	.item {
		background-color: #fff;
		border-radius: 12rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.item-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 20rpx;
		border-bottom: 1px solid #eee;
	}

	.item-name {
		font-weight: bold;
		font-size: 28rpx;
	}

	.item-content {
		padding-top: 20rpx;
		display: flex;
		justify-content: space-between;
	}

	.item-info {
		flex: 1;
	}

	.info-item {
		display: flex;
		margin-bottom: 10rpx;
	}

	.label {
		color: #666;
		width: 150rpx;
		min-width: 150rpx !important;
	}

	.value {
		color: #333;
	}

	.petType {
		color: #333;
		font-size: 16px;
		margin-left: 5px;
	}

	.pet-image-box {
		width: 100%;
		height: 100%;
		overflow: hidden;
		margin-bottom: 20rpx;
		background: #f8f9fa;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.pet-image {
		margin: 10px 0;
		width: 90px;
		height: 90px;
		object-fit: cover;
		border-radius: 50%;
	}

	.detail-popup {
		background-color: #fff;
		border-radius: 12rpx;
		width: 600rpx;
	}

	.detail-header {
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #eee;
	}

	.detail-title {
		font-size: 32rpx;
		font-weight: bold;
	}

	.detail-content {
		padding: 20rpx;
		max-height: 1000rpx;
		overflow-y: auto;
	}

	.detail-item {
		display: flex;
		margin-bottom: 20rpx;
		align-items: center;
	}

	.detail-label {
		width: 150rpx;
		color: #666;
		min-width: 150rpx !important;
	}

	.detail-values {
		flex: 1;
		display: flex;
		flex-wrap: wrap;
		gap: 8rpx;
		justify-content: flex-start;
	}

	.detail-value {
		flex: 1;
		color: #333;
	}

	.detail-footer {
		padding: 20rpx;
		border-top: 1px solid #eee;
		display: flex;
		justify-content: flex-end;
	}

	.detail-btn {
		min-width: 160rpx;
	}
</style>