<template>
	<view class="container">
		<!-- 搜索筛选区域 -->
		<view class="filter-container">
			<uni-search-bar @confirm="handleSearch" placeholder="输入订单号/用户姓名" />
			<uni-segmented-control :current="currentStatus" :values="statusOptions.map(item => item.text)"
				@clickItem="handleStatusChange" style-type="button" active-color="#007AFF" />
		</view>

		<!-- 订单列表 -->
		<view class="order-list" v-if="orderList.length > 0">
			<view class="order-item" v-for="item in orderList" :key="item.id">
				<view class="order-header"  @click="showDetail(item)">
					<text class="order-no">订单号: {{item.orderNo}}</text>
					<text class="value price">{{item.statusText}}</text>
				</view>
				<view class="order-content">
					<view class="order-info">
						<view class="info-item">
							<text class="label">用户:</text>
							<text class="value">{{item.name}}</text>
						</view>
						<view class="info-item">
							<text class="label">电话:</text>
							<text class="value" @click="callPhone(item.phone)">{{item.phone}}</text>
						</view>
						<view class="info-item" @click="showPetDetail(item)">
							<text class="label">宠物:</text>
							<text class="value">{{item.petName}} |<text
									class="petType">{{ item.petType === 'dog' ? '🐶 狗狗' : '🐱 猫咪' }}</text></text>
						</view>
						<view class="info-item">
							<text class="label">金额:</text>
							<text class="value">
								<text
									class="price">¥{{item.price}}/<text>{{ item.petType === 'dog' ? '天' : '次' }}</text></text>
								<text class="label" style="margin: 0 5px 0 15px;">总价:</text><text
									class="price">¥{{item.totalPrice}}</text>
							</text>
						</view>
						<view class="info-item">
							<text class="label">服务日期:</text>
							<view class="detail-values">
								<text class="value" v-for="(item, index) in item.selectedDates" :key="index">
									<span class="selected-date">{{item}}</span>
								</text>
							</view>

						</view>
						<view class="info-item" v-if="item.timeSlots">
							<text class="label">遛狗时间:</text>
							<view class="detail-values">
								<text class="value" v-for="(item, index) in item.timeSlots" :key="index">
									<span class="selected-date">{{item}}</span>
								</text>
							</view>
						</view>
						<view class="info-item" v-if="item.frequencyText">
							<text class="label">服务频率:</text>
							<text class="value">{{item.frequencyText}}</text>
						</view>
						<view class="info-item">
							<text class="label">创建时间:</text>
							<text class="value">{{item.orderedTime}}</text>
						</view>
						<view class="info-item" v-if="item.description">
							<text class="label">备注:</text>
							<text class="value">{{item.description}}</text>
						</view>

					</view>
					<view class="order-actions">
						<button class="action-btn" size="mini" @click="showDetail(item)">详情</button>
						<button v-if="item.showAction && item.orderStatus != 30" class="action-btn" size="mini"
							type="primary" @click="showStatusDialog(item)">修改状态</button>
						<button class="action-btn" size="mini" type="warn" @click="callPhone(item.phone)">联系用户</button>
						<button v-if="item.showAction && item.orderStatus === 30" class="action-btn" size="mini"
							type="primary" @click="addComment(item)">追加评价</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view class="empty-state" v-else>
			<uni-icons type="info" size="50" color="#ccc"></uni-icons>
			<text class="empty-text">暂无订单数据</text>
		</view>

		<!-- 分页 -->
		<uni-pagination :total="total" :current="pagination.current" :pageSize="pagination.pageSize"
			@change="handlePageChange" showIcon />

		<!-- 订单详情弹窗 -->
		<uni-popup ref="detailPopup" type="dialog">
			<view class="detail-popup">
				<view class="detail-header">
					<text class="detail-title">订单详情</text>
					<uni-icons type="close" size="20" @click="$refs.detailPopup.close()"></uni-icons>
				</view>
				<view class="detail-content">
					<view class="detail-item" v-if="currentOrder.orderNo">
						<text class="detail-label">订单号:</text>
						<text class="detail-value">{{currentOrder.orderNo}}</text>
					</view>
					<view class="detail-item" v-if="currentOrder.name">
						<text class="detail-label">用户:</text>
						<text class="detail-value">{{currentOrder.name}}</text>
					</view>
					<view class="detail-item" v-if="currentOrder.phone">
						<text class="detail-label">电话:</text>
						<text class="detail-value" @click="callPhone(currentOrder.phone)">{{currentOrder.phone}}</text>
					</view>
					<view class="detail-item" v-if="currentOrder.petName" @click="showPetDetail(currentOrder)">
						<text class="detail-label">宠物:</text>
						<text class="detail-value">{{currentOrder.petName}} |<text
								class="petType">{{ currentOrder.petType === 'dog' ? '🐶 狗狗' : '🐱 猫咪' }}</text></text>
					</view>
					<view class="detail-item" v-if="currentOrder.totalPrice">
						<text class="detail-label">金额:</text>
						<text class="detail-value">
							<text
								class="price">¥{{currentOrder.price}}/<text>{{ currentOrder.petType === 'dog' ? '天' : '次' }}</text></text>
							<text class="detail-label" style="margin: 0 5px 0 15px;">总价:</text><text
								class="price">¥{{currentOrder.totalPrice}}</text>
						</text>
					</view>
					<view class="detail-item" v-if="currentOrder.statusText">
						<text class="detail-label">订单状态:</text>
						<text class="detail-value price">{{currentOrder.statusText}}</text>
					</view>
					<view class="detail-item" v-if="currentOrder.selectedDates">
						<text class="detail-label">服务日期:</text>
						<view class="detail-values">
							<text class="detail-value" v-for="(item, index) in currentOrder.selectedDates" :key="index">
								<span class="selected-date">{{item}}</span>
							</text>
						</view>
					</view>
					<view class="detail-item" v-if="currentOrder.frequencyText">
						<text class="detail-label">服务频率:</text>
						<text class="detail-value">{{currentOrder.frequencyText}}</text>
					</view>
					<view class="detail-item" v-if="currentOrder.timeSlots">
						<text class="detail-label">遛狗时间:</text>
						<view class="detail-values">
							<text class="value" v-for="(item, index) in currentOrder.timeSlots" :key="index">
								<span class="selected-date">{{item}}</span>
							</text>
						</view>
					</view>
					<view class="detail-item" v-if="currentOrder.orderedTime">
						<text class="detail-label">创建时间:</text>
						<text class="detail-value">{{currentOrder.orderedTime}}</text>
					</view>
					<view class="detail-item" v-if="currentOrder.cancellationTime">
						<text class="detail-label">取消时间:</text>
						<text class="detail-value">{{currentOrder.cancellationTime}}</text>
					</view>
					<view class="detail-item" v-if="currentOrder.paymentTime">
						<text class="detail-label">付款时间:</text>
						<text class="detail-value">{{currentOrder.paymentTime}}</text>
					</view>
					<view class="detail-item" v-if="currentOrder.refundTime">
						<text class="detail-label">退款时间:</text>
						<text class="detail-value">{{currentOrder.refundTime}}</text>
					</view>
					<view class="detail-item" v-if="currentOrder.serviceTime">
						<text class="detail-label">服务时间:</text>
						<text class="detail-value">{{currentOrder.serviceTime}}</text>
					</view>
					<view class="detail-item" v-if="currentOrder.completeTime">
						<text class="detail-label">完成时间:</text>
						<text class="detail-value">{{currentOrder.completeTime}}</text>
					</view>
					<view class="detail-item" v-if="currentOrder.address && currentOrder.address != '0'">
						<text class="detail-label">地址:</text>
						<text class="detail-value">{{currentOrder.address}}</text>
					</view>
					<view class="detail-item" v-if="currentOrder.description">
						<text class="detail-label">备注:</text>
						<text class="detail-value">{{currentOrder.description}}</text>
					</view>
					
				</view>
				<view class="detail-footer">
					<!-- <button class="detail-btn" @click="$refs.detailPopup.close()">关闭</button> -->
					<button v-if="currentOrder.showAction && currentOrder.orderStatus != 30" class="detail-btn"
						size="mini" type="primary" @click="showStatusDialog(currentOrder)">修改状态</button>
					<button class="detail-btn" size="mini" type="warn"
						@click="callPhone(currentOrder.phone)">联系用户</button>
				</view>
			</view>
		</uni-popup>

		<!-- 宠物详情弹窗 -->
		<uni-popup ref="detailPetPopup" type="dialog">
			<view class="detail-popup">
				<view class="detail-header">
					<text class="detail-title">萌宠详情</text>
					<uni-icons type="close" size="20" @click="$refs.detailPetPopup.close()"></uni-icons>
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
					<view class="detail-item" v-if="petItem.breed">
						<text class="detail-label">体型:</text>
						<text class="detail-value">{{petItem.breed}}</text>
					</view>

				</view>
			</view>
		</uni-popup>

		<!-- 状态修改弹窗 -->
		<uni-popup ref="statusPopup" type="dialog">
			<view class="status-popup">
				<view class="status-header">
					<text class="status-title">修改订单状态</text>
				</view>
				<view class="status-content">
					<uni-data-select v-if="currentOrder.showAction" v-model="currentOrder.status"
						:localdata="statusLabelOptions.filter(item => item.value !== 0)" :clear="false" />
				</view>
				<view class="status-footer">
					<button class="status-btn cancel" @click="$refs.statusPopup.close()">取消</button>
					<button class="status-btn confirm" type="primary" @click="updateOrderStatus">确认</button>
				</view>
			</view>
		</uni-popup>

		<uni-popup ref="commentPopup" type="dialog">
			<view class="detail-popup comment-popup">
				<view class="detail-header">
					<text class="detail-title">追加评论</text>
					<uni-icons type="close" size="20" @click="closeCommentPopup"></uni-icons>
				</view>
				<view class="detail-content">
					<view class="comment-form">

						<view class="form-item">
							<text class="form-label">评分</text>
							<view class="rating-container">
								<view class="custom-rate">
									<text v-for="i in 5" :key="i" class="rate-star"
										:class="{'rate-star-active': i <= commentForm.score}"
										@click="setRating(i)">★</text>
								</view>
								<text class="rating-text">{{commentForm.score}}分</text>
							</view>
						</view>

						<view class="form-item">
							<text class="form-label">标题</text>
							<input class="form-input" v-model="commentForm.title" placeholder="请输入评论标题" />
						</view>

						<view class="form-item">
							<text class="form-label">内容</text>
							<textarea class="form-textarea" v-model="commentForm.content" placeholder="请输入评论内容" />
						</view>

						<view class="form-item">
							<text class="form-label">图片</text>
							<view class="upload-container">
								<view class="upload-preview" v-if="commentForm.imageUrl">
									<image class="preview-img" :src="commentForm.imageUrl" mode="aspectFill"></image>
									<text class="delete-icon" @click="removeImage">×</text>
								</view>
								<view class="upload-btn" @click="chooseImage(currentOrder)" v-if="!commentForm.imageUrl">
									<uni-icons type="camera-filled" size="24" color="#999"></uni-icons>
									<text class="upload-text">上传图片</text>
								</view>
							</view>
						</view>

						<view class="form-item">
							<text class="form-label">视频</text>
							<view class="upload-container">
								<view class="upload-preview" v-if="commentForm.videoUrl">
									<video class="preview-video" :src="commentForm.videoUrl" controls></video>
									<text class="delete-icon" @click="removeVideo">×</text>
								</view>
								<view class="upload-btn" @click="chooseVideo(currentOrder)" v-if="!commentForm.videoUrl">
									<uni-icons type="videocam-filled" size="24" color="#999"></uni-icons>
									<text class="upload-text">上传视频</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="detail-footer">
					<button class="status-btn cancel" @click="closeCommentPopup">取消</button>
					<button class="status-btn confirm" type="primary" @click="submitComment">提交评论</button>
				</view>
			</view>
		</uni-popup>

	</view>
</template>

<script>
	import {
		orders,
		updateOrderStatus
	} from '@/api/order/order'
	import {
		getPet
	} from '@/api/pet/pet'
	import {
		addComments
	} from '@/api/comment/comment'
	import {
		uploadFile
	} from '@/api/upload/upload'

	export default {
		data() {
			return {
				dogIcon: '/static/images/pet/default_dog.png',
				catIcon: '/static/images/pet/default_cat.png',
				orderList: [],
				currentStatus: 0,
				total: 0,
				pagination: {
					current: 1,
					pageSize: 10
				},
				currentStatus: 0,
				statusOptions: [{
						text: '全部',
						value: 0
					},
					{
						text: '待确认',
						value: 1
					},
					{
						text: '待服务',
						value: 2
					},
					{
						text: '服务中',
						value: 3
					},
					{
						text: '已完成',
						value: 4
					},
					{
						text: '已取消',
						value: 5
					}
				],
				statusLabelOptions: [{
						text: '确认(支付)',
						value: 20
					},
					{
						text: '确定服务',
						value: 21
					},
					{
						text: '服务完成',
						value: 30
					},
					{
						text: '发起退款',
						value: 22
					},
					{
						text: '退款完成',
						value: 23
					},
					{
						text: '确定取消',
						value: 11
					}
				],
				statusMap: {
					1: '待确认',
					2: '待服务',
					3: '服务中',
					4: '已完成',
					5: '已取消'
				},
				currentOrder: {},
				petItem: {},
				searchKey: '',
				loading: false,
				commentForm: {
					userId: '',
					orderId: '',
					petId: '',
					type: 0,
					petType: '',
					title: '',
					content: '',
					score: 5,
					imageUrl: '',
					videoUrl: ''
				},

			}
		},
		// 添加onLoad生命周期钩子
		onLoad() {
			this.loadOrders()
		},
		methods: {
			async loadOrders() {
				try {
					this.loading = true
					const params = {
						page: this.pagination.current,
						pageSize: this.pagination.pageSize,
						status: this.currentStatus,
						keyword: this.searchKey
					}

					const res = await orders(params)
					this.orderList = res.data.list
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

			// 添加获取状态标签类型的方法
			getStatusType(status) {
				const typeMap = {
					1: 'warning', // 待确认 - 警告色
					2: 'primary', // 待服务 - 主色
					3: 'info', // 服务中 - 信息色
					4: 'success', // 已完成 - 成功色
					5: 'error' // 已取消 - 错误色
				}
				return typeMap[status] || 'default'
			},

			// 添加搜索处理方法
			handleSearch(e) {
				// 获取搜索关键词
				this.searchKey = e.value
				// 重置分页到第一页
				this.pagination.current = 1
				// 重新加载订单数据
				this.loadOrders()
			},

			// 添加显示订单详情的方法
			showDetail(item) {
				this.currentOrder = {
					...item
				}
				this.$refs.detailPopup.open()
			},

			async showPetDetail(item) {
				try {
					const res = await getPet(item.petId)
					if (res && res.code === 200) {
						this.currentOrder = {
							...item
						}
						this.petItem = {
							...res.data
						}
						this.$refs.detailPetPopup.open()
						return
					}
				} catch (error) {
					uni.showToast({
						title: '请求服务异常',
						icon: 'none'
					})
				}

			},

			// 添加显示状态修改弹窗的方法
			showStatusDialog(item) {
				this.currentOrder = {
					...item
				}
				this.$refs.statusPopup.open()
			},

			addComment(item) {
				this.currentOrder = {
					...item
				}
				this.commentForm = {
						userId: item.userId,
						orderId: item.orderId,
						petId: item.petId,
						type: 0,
						petType: item.petType,
						title: '',
						content: '',
						score: 5,
						imageUrl: '',
						videoUrl: ''
					},
					this.$refs.commentPopup.open()
			},

			closeCommentPopup() {
				this.$refs.commentPopup.close()
			},

			setRating(score) {
				// this.commentForm.score = score
				this.$set(this.commentForm, 'score', score);
				this.commentForm.score = score;
				// // 强制更新视图
				this.$forceUpdate();
			},

			// 选择图片
			chooseImage(currentOrder) {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						const tempFilePath = res.tempFilePaths[0]
						// 这里可以添加上传图片到服务器的逻辑
						// 暂时直接使用本地路径
						this.commentForm.imageUrl = tempFilePath

						// 实际项目中应该上传到服务器
						this.uploadFile(tempFilePath, 'image', currentOrder.userId, currentOrder.orderId)
					}
				})
			},

			// 选择视频
			chooseVideo(currentOrder) {
				uni.chooseVideo({
					sourceType: ['album', 'camera'],
					maxDuration: 60,
					camera: 'back',
					success: (res) => {
						const tempFilePath = res.tempFilePath
						// 这里可以添加上传视频到服务器的逻辑
						// 暂时直接使用本地路径
						this.commentForm.videoUrl = tempFilePath

						// 实际项目中应该上传到服务器
						this.uploadFile(tempFilePath, 'video', currentOrder.userId, currentOrder.orderId)
					}
				})
			},

			// 移除图片
			removeImage() {
				this.commentForm.imageUrl = ''
			},

			// 移除视频
			removeVideo() {
				this.commentForm.videoUrl = ''
			},

			// 上传文件到服务器（示例方法）
			async uploadFile(filePath, fileType, userId, orderId) {
				uni.showLoading({
					title: '上传中...'
				})

				const formData = {
					'type': fileType, // 文件类型：image或video,file
					'userId': userId, 
					'orderId': orderId, 
				}

				// 这里应该是实际的上传逻辑
				const res =  await uploadFile(filePath, formData)
				if (res && res.code === 200) {
					const data = res.data
					if (fileType === 'image') {
						this.commentForm.imageUrl = data.url
					} else  {
						this.commentForm.videoUrl = data.url
					}
					uni.hideLoading()
					return
				}
				uni.showToast({
					title: '上传文件失败',
					icon: 'none'
				})
			},

			// 提交评论
			async submitComment() {
				// 表单验证
				if (!this.commentForm.content) {
					uni.showToast({
						title: '请输入评论内容',
						icon: 'none'
					})
					return
				}

				if (!this.commentForm.score) {
					uni.showToast({
						title: '请选择评分',
						icon: 'none'
					})
					return
				}

				try {
					uni.showLoading({
						title: '提交中...'
					})

					// 这里应该是实际的提交评论API调用
					const res = await addComments(this.commentForm)
					if (res && res.code === 200) {
						// 模拟提交成功
						setTimeout(() => {
							uni.hideLoading()
							uni.showToast({
								title: '评论提交成功'
							})
							this.closeCommentPopup()
							// 刷新订单列表
							this.loadOrders()
						}, 1000)
						return
					}
					uni.showToast({
						title: '评论提交失败',
						icon: 'none'
					})

				} catch (error) {
					uni.hideLoading()
					uni.showToast({
						title: '评论提交失败',
						icon: 'none'
					})
				}
			},


			async handleStatusChange(event) {
				// 获取当前选中的状态索引
				this.currentStatus = event.currentIndex
				// 重置分页到第一页
				this.pagination.current = 1
				// 重新加载订单数据
				this.loadOrders()
			},

			async updateOrderStatus() {
				try {
					uni.showLoading({
						title: '更新中...'
					})
					const id = this.currentOrder.id
					const data = {
						status: this.currentOrder.status
					}
					const res = await updateOrderStatus(id, data)

					if (res && res.code === 200) {
						uni.showToast({
							title: '更新成功'
						})
						this.$refs.statusPopup.close()
						this.loadOrders()
						return
					}
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				} catch (error) {
					let msg = '更新失败'
					if (error === 500004) {
						msg = '此订单状态不可更新！'
					} else if (error === 500003) {
						msg = '订单不存在！'
					}
					uni.showToast({
						title: msg,
						icon: 'none'
					})
				} finally {
					uni.hideLoading()
				}
			},

			// 添加分页处理方法
			handlePageChange(e) {
				this.pagination.current = e.current
				this.loadOrders()
			},

			callPhone(phoneNumber) {
				// 检查是否在移动端环境
				if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
					uni.makePhoneCall({
						phoneNumber: phoneNumber,
						success: () => {
							console.log('拨打电话成功');
						},
						fail: (err) => {
							console.error('拨打电话失败', err);
							uni.showToast({
								title: '拨打电话失败',
								icon: 'none'
							});
						}
					});
					// 跳转到电话拨号界面
					// window.location.href = `tel:${phoneNumber}`;
				} else {
					uni.showToast({
						title: '拨打电话功能仅支持移动设备',
						icon: 'none'
					})
				}
			},


		}
	}
</script>

<style scoped>
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

	.order-list {
		margin-bottom: 20rpx;
	}

	.order-item {
		background-color: #fff;
		border-radius: 12rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.order-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 20rpx;
		border-bottom: 1px solid #eee;
	}

	.order-no {
		font-weight: bold;
		font-size: 28rpx;
	}

	.order-content {
		padding-top: 20rpx;
		display: flex;
		justify-content: space-between;
	}

	.order-info {
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

	.selected-date {
		margin-right: 5px;
	}

	.price {
		color: #f56c6c;
		font-weight: bold;
	}

	.order-actions {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.action-btn {
		margin: 10rpx 0;
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

	/* 详情弹窗样式 */
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

	/* 状态修改弹窗样式 */
	.status-popup {
		background-color: #fff;
		border-radius: 12rpx;
		width: 600rpx;
	}

	.status-header {
		padding: 20rpx;
		border-bottom: 1px solid #eee;
	}

	.status-title {
		font-size: 32rpx;
		font-weight: bold;
	}

	.status-content {
		padding: 30rpx 20rpx;
	}

	.status-footer {
		padding: 20rpx;
		border-top: 1px solid #eee;
		display: flex;
		justify-content: flex-end;
	}

	.status-btn {
		min-width: 130rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 30rpx;
	}

	.cancel {
		background-color: #f2f2f2;
		color: #666;
	}

	/* 评论弹窗样式 */
	.comment-popup {
		width: 650rpx;
	}

	.comment-form {
		width: 100%;
	}

	.form-item {
		margin-bottom: 20rpx;
	}

	.form-label {
		display: block;
		margin-bottom: 10rpx;
		font-size: 28rpx;
		color: #333;
	}

	.form-input {
		width: 100%;
		height: 70rpx;
		border: 1px solid #eee;
		border-radius: 8rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
		font-size: 28rpx;
	}

	.form-textarea {
		width: 100%;
		height: 200rpx;
		border: 1px solid #eee;
		border-radius: 8rpx;
		padding: 20rpx;
		box-sizing: border-box;
		font-size: 28rpx;
	}

	.rating-container {
		display: flex;
		align-items: center;
	}

	.custom-rate {
		display: flex;
	}

	.rating-text {
		margin-left: 20rpx;
		font-size: 28rpx;
		color: #333;
	}

	.rate-star {
		font-size: 40rpx;
		color: #DDDDDD;
		margin-right: 10rpx;
		text-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
	}

	.rate-star-active {
		color: #FFCC00;
		text-shadow: 0 0 2px rgba(255, 204, 0, 0.3);
	}

	.upload-container {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
	}

	.upload-btn {
		width: 200rpx;
		height: 200rpx;
		border: 1px dashed #ddd;
		border-radius: 8rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.upload-text {
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #999;
	}

	.upload-preview {
		position: relative;
		width: 200rpx;
		height: 200rpx;
		border-radius: 8rpx;
		overflow: hidden;
	}

	.preview-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.preview-video {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.delete-icon {
		position: absolute;
		top: 0;
		right: 0;
		width: 40rpx;
		height: 40rpx;
		background-color: rgba(0, 0, 0, 0.5);
		color: #fff;
		font-size: 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1;
	}
</style>