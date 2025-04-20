<template>
	<view class="container">
		<!-- 搜索筛选区域 -->
		<view class="filter-container">
			<uni-search-bar @confirm="handleSearch" placeholder="输入地址/用户姓名" />
		</view>

		<!-- 列表 -->
		<view class="item-list" v-if="itemList.length > 0">
			<view class="item" v-for="item in itemList" :key="item.id">
				<view class="item-content">
					<view class="item-info">
						<view class=" info-item">
							<text class="label">姓名:</text>
							<text class="value">{{item.userName}}</text>
						</view>
						<view class="info-item" v-if="item.phone">
							<text class="label">电话:</text>
							<text class="value">{{item.phone}}岁</text>
						</view>
						<view class="info-item" v-if="item.address">
							<text class="label">地址:</text>
							<text class="value">{{item.address}}</text>
						</view>
						<view class="info-item" v-if="item.addressNo">
							<text class="label">门牌号:</text>
							<text class="value">{{item.addressNo}}</text>
						</view>
						<view class="info-item" v-if="item.description">
							<text class="label">备注:</text>
							<text class="value">{{item.description}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view class="empty-state" v-else>
			<uni-icons type="info" size="50" color="#ccc"></uni-icons>
			<text class="empty-text">暂无地址数据</text>
		</view>

		<!-- 分页 -->
		<uni-pagination :total="total" :current="pagination.current" :pageSize="pagination.pageSize"
			@change="handlePageChange" showIcon />

	</view>

</template>

<script>
	import {
		getAddress
	} from '@/api/address/address'
	export default {
		data() {
			return {
				itemList: [],
				total: 0,
				searchKey: '',
				loading: false,
				pagination: {
					current: 1,
					pageSize: 10
				},
			}
		},
		// 添加onLoad生命周期钩子
		onLoad() {
			this.loadAddress()
		},

		methods: {
			async loadAddress() {
				try {
					this.loading = true
					const params = {
						page: this.pagination.current,
						pageSize: this.pagination.pageSize,
						keyword: this.searchKey
					}

					const res = await getAddress(params)
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

			// 添加搜索处理方法
			handleSearch(e) {
				// 获取搜索关键词
				this.searchKey = e.value
				// 重置分页到第一页
				this.pagination.current = 1
				// 重新加载订单数据
				this.loadAddress()
			},

			// 添加分页处理方法
			handlePageChange(e) {
				this.pagination.current = e.current
				this.loadAddress()
			},
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
		width: 150px;
		height: 150px;
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