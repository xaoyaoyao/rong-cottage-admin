<template>
	<view class="container">
		<!-- 搜索筛选区域 -->
		<view class="filter-container">
			<uni-search-bar @confirm="handleSearch" placeholder="输入宠物名字/用户姓名" />
			<uni-segmented-control :current="currentPetType" :values="petTypeOptions.map(item => item.text)"
				@clickItem="handleStatusChange" style-type="button" active-color="#007AFF" />
		</view>

		<!-- 列表 -->
		<view class="item-list" v-if="itemList.length > 0">
			<view class="item" v-for="item in itemList" :key="item.id" @click="showDetail(item)">
				<view class="item-header">
					<view class="user-info">
						<image class="user-avatar" :src="item.userAvatar || avatarUrl"></image>
						<text class="username">{{item.username}}</text>
					</view>
					<view class="rating">
						<!-- <uni-rate :value="item.score || 5" disabled size="18" active-color="#FF9500" /> -->
						<view class="custom-rate">
							<text v-for="i in 5" :key="i" class="rate-star" :class="{'rate-star-active': i <= (item.score || 5)}">★</text>
						</view>
					</view>
				</view>
				<view class="item-content">
					<view class="comment-title" v-if="item.title">{{item.title}}</view>
					<view class="comment-content" v-if="item.content">{{item.content}}</view>
					<!-- <view class="media-preview" v-if="item.images && item.images.length">
						<image class="preview-image" v-for="(img, index) in item.images.slice(0, 3)" :key="index" :src="img" mode="aspectFill"></image>
						<view class="more-indicator" v-if="item.images.length > 3">+{{item.images.length - 3}}</view>
					</view> -->
					<view class="media-preview" v-if="item.imageUrl">
						<image class="preview-image" :src="item.imageUrl" mode="aspectFill"></image>
					</view>
					<view class="pet-info">
						<text class="pet-name">{{item.petName}}</text>
						<text class="pet-type">{{ item.petType === 'dog' ? '🐶 狗狗' : '🐱 猫咪' }}</text>
					</view>
					<view class="comment-time">发布于 {{item.time}}</view>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view class="empty-state" v-else>
			<uni-icons type="info" size="50" color="#ccc"></uni-icons>
			<text class="empty-text">暂无评论数据</text>
		</view>

		<!-- 分页 -->
		<uni-pagination :total="total" :current="pagination.current" :pageSize="pagination.pageSize"
			@change="handlePageChange" showIcon />

		<!-- 评论详情弹窗 -->
		<uni-popup ref="detailPopup" type="dialog">
			<view class="detail-popup">
				<view class="detail-header">
					<text class="detail-title">评论详情</text>
					<uni-icons type="close" size="20" @click="$refs.detailPopup.close()"></uni-icons>
				</view>
				<view class="detail-content">
					<view class="detail-user-info">
						<image class="detail-user-avatar" :src="currentComment.userAvatar || avatarUrl"></image>
						<view class="detail-user-meta">
							<text class="detail-username">{{currentComment.username}}</text>
							<!-- <uni-rate :value="currentComment.rating || 5" disabled size="18" active-color="#FF9500" /> -->
							<view class="custom-rate">
								<text v-for="i in 5" :key="i" class="rate-star" :class="{'rate-star-active': i <= (currentComment.score || 5)}">★</text>
							</view>
						</view>
					</view>

					<view class="detail-item" v-if="currentComment.title">
						<text class="detail-label">标题:</text>
						<text class="detail-value">{{currentComment.title}}</text>
					</view>

					<view class="detail-item">
						<text class="detail-label">内容:</text>
						<text class="detail-value">{{currentComment.content}}</text>
					</view>

					<view class="detail-item">
						<text class="detail-label">宠物:</text>
						<view class="detail-pet-info">
							<image class="detail-pet-avatar"
								:src="currentComment.petAvatar || (currentComment.petType === 'dog' ? dogIcon : catIcon)">
							</image>
							<view class="detail-pet-meta">
								<text>{{currentComment.petName}}</text>
								<text
									class="detail-pet-type">{{currentComment.petType === 'dog' ? '🐶 狗狗' : '🐱 猫咪'}}</text>
							</view>
						</view>
					</view>

					<!-- <view class="detail-item" v-if="currentComment.images && currentComment.images.length">
						<text class="detail-label">图片:</text>
						<view class="detail-images">
							<image class="detail-image" v-for="(img, index) in currentComment.images" :key="index" 
								:src="img" mode="widthFix" @click="previewImage(img, currentComment.images)"></image>
						</view>
					</view> -->

					<view class="detail-item" v-if="currentComment.imageUrl">
						<text class="detail-label">图片:</text>
						<view class="detail-images">
							<image class="detail-image" :src="currentComment.imageUrl" mode="widthFix"
								@click="previewImageOne(currentComment.imageUrl)"></image>
						</view>
					</view>

					<view class="detail-item" v-if="currentComment.videoUrl">
						<text class="detail-label">视频:</text>
						<video class="detail-video" :src="currentComment.videoUrl" controls></video>
					</view>

					<view class="detail-item">
						<text class="detail-label">评论时间:</text>
						<text class="detail-value">{{currentComment.time}}</text>
					</view>
				</view>
			</view>
		</uni-popup>

	</view>

</template>

<script>
	import {
		getComments
	} from '@/api/comment/comment'
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
				searchKey: '',
				loading: false,
				currentComment: {},
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
			this.loadComments()
		},

		methods: {
			async loadComments() {
				try {
					this.loading = true
					const params = {
						page: this.pagination.current,
						pageSize: this.pagination.pageSize,
						petType: this.petTypesMap[this.currentPetType],
						keyword: this.searchKey
					}

					const res = await getComments(params)
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
				this.loadComments()
			},

			// 添加搜索处理方法
			handleSearch(e) {
				// 获取搜索关键词
				this.searchKey = e.value
				// 重置分页到第一页
				this.pagination.current = 1
				// 重新加载订单数据
				this.loadComments()
			},

			// 添加分页处理方法
			handlePageChange(e) {
				this.pagination.current = e.current
				this.loadComments()
			},

			async showDetail(item) {
				this.currentComment = {
					...item
				}

				this.$refs.detailPopup.open()
			},

			// 预览图片
			previewImage(current, urls) {
				uni.previewImage({
					current: current,
					urls: urls
				})
			},

			previewImageOne(current) {
				uni.previewImage({
					current: current,
					urls: [current]
				})
			}
		}


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

	.user-info {
		display: flex;
		align-items: center;
	}

	.user-avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		margin-right: 10rpx;
	}

	.username {
		font-weight: bold;
		font-size: 28rpx;
	}

	.rating {
		display: flex;
		align-items: center;
	}

	.custom-rate {
		display: flex;
	}
	
	.rate-star {
		font-size: 18px;
		color: #DDDDDD;
		margin-right: 2px;
	}
	
	.rate-star-active {
		color: #FFCC00;
	}

	.item-content {
		padding-top: 20rpx;
	}

	.comment-title {
		font-weight: bold;
		font-size: 30rpx;
		margin-bottom: 10rpx;
	}

	.comment-content {
		font-size: 28rpx;
		color: #333;
		margin-bottom: 16rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
	}

	.media-preview {
		display: flex;
		margin-bottom: 16rpx;
		position: relative;
	}

	.preview-image {
		width: 150rpx;
		height: 150rpx;
		margin-right: 10rpx;
		border-radius: 8rpx;
	}

	.more-indicator {
		position: absolute;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		color: #fff;
		padding: 4rpx 10rpx;
		border-radius: 4rpx;
		font-size: 24rpx;
	}

	.pet-info {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.pet-name {
		font-size: 26rpx;
		color: #666;
		margin-right: 10rpx;
	}

	.pet-type {
		font-size: 26rpx;
		color: #666;
	}

	.comment-time {
		font-size: 24rpx;
		color: #999;
	}

	// 详情弹窗样式
	.detail-popup {
		background-color: #fff;
		border-radius: 12rpx;
		width: 650rpx;
		max-height: 80vh;
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
		max-height: calc(80vh - 100rpx);
		overflow-y: auto;
	}

	.detail-user-info {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		padding-bottom: 20rpx;
		border-bottom: 1px solid #f5f5f5;
	}

	.detail-user-avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.detail-user-meta {
		display: flex;
		flex-direction: column;
	}

	.detail-username {
		font-weight: bold;
		font-size: 28rpx;
		margin-bottom: 6rpx;
	}

	.detail-item {
		display: flex;
		margin-bottom: 20rpx;
	}

	.detail-label {
		width: 150rpx;
		color: #666;
		min-width: 150rpx !important;
	}

	.detail-value {
		flex: 1;
		color: #333;
	}

	.detail-pet-info {
		display: flex;
		align-items: center;
	}

	.detail-pet-avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		margin-right: 10rpx;
	}

	.detail-pet-meta {
		display: flex;
		flex-direction: column;
	}

	.detail-pet-type {
		font-size: 24rpx;
		color: #666;
	}

	.detail-images {
		display: flex;
		flex-wrap: wrap;
		gap: 10rpx;
	}

	.detail-image {
		width: 320rpx;
		border-radius: 8rpx;
	}

	.detail-video {
		width: 100%;
		height: 400rpx;
		border-radius: 8rpx;
	}
</style>