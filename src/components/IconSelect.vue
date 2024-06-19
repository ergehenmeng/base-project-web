<template>
  <el-scrollbar height="200px">
    <el-row>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Plus' }" title="Plus" @click="selectIcon('Plus')">
          <Plus />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Minus' }" title="Minus" @click="selectIcon('Minus')">
          <Minus />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'CirclePlus' }" title="CirclePlus" @click="selectIcon('CirclePlus')">
          <CirclePlus />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Search' }" title="Search" @click="selectIcon('Search')">
          <Search />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Female' }" title="Female" @click="selectIcon('Female')">
          <Female />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Male' }" title="Male" @click="selectIcon('Male')">
          <Male />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Aim' }" title="Aim" @click="selectIcon('Aim')">
          <Aim />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'House' }" title="House" @click="selectIcon('House')">
          <House />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'FullScreen' }" title="FullScreen" @click="selectIcon('FullScreen')">
          <FullScreen />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Loading' }" title="Loading" @click="selectIcon('Loading')">
          <Loading />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Link' }" title="Link" @click="selectIcon('Link')">
          <Link />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Service' }" title="Service" @click="selectIcon('Service')">
          <Service />
        </el-icon>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Pointer' }" title="Pointer" @click="selectIcon('Pointer')">
          <Pointer />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Star' }" title="Star" @click="selectIcon('Star')">
          <Star />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Notification' }" title="Notification" @click="selectIcon('Notification')">
          <Notification />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Connection' }" title="Connection" @click="selectIcon('Connection')">
          <Connection />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ChatDotRound' }" title="ChatDotRound" @click="selectIcon('ChatDotRound')">
          <ChatDotRound />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Setting' }" title="Setting" @click="selectIcon('Setting')">
          <Setting />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Clock' }" title="Clock" @click="selectIcon('Clock')">
          <Clock />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Position' }" title="Position" @click="selectIcon('Position')">
          <Position />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Discount' }" title="Discount" @click="selectIcon('Discount')">
          <Discount />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Odometer' }" title="Odometer" @click="selectIcon('Odometer')">
          <Odometer />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ChatSquare' }" title="ChatSquare" @click="selectIcon('ChatSquare')">
          <ChatSquare />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ChatRound' }" title="ChatRound" @click="selectIcon('ChatRound')">
          <ChatRound />
        </el-icon>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ChatLineRound' }" title="ChatLineRound" @click="selectIcon('ChatLineRound')">
          <ChatLineRound />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ChatLineSquare' }" title="ChatLineSquare" @click="selectIcon('ChatLineSquare')">
          <ChatLineSquare />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ChatDotSquare' }" title="ChatDotSquare" @click="selectIcon('ChatDotSquare')">
          <ChatDotSquare />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'View' }" title="View" @click="selectIcon('View')">
          <View />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Hide' }" title="Hide" @click="selectIcon('Hide')">
          <Hide />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Unlock' }" title="Unlock" @click="selectIcon('Unlock')">
          <Unlock />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Lock' }" title="Lock" @click="selectIcon('Lock')">
          <Lock />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'RefreshRight' }" title="RefreshRight" @click="selectIcon('RefreshRight')">
          <RefreshRight />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'RefreshLeft' }" title="RefreshLeft" @click="selectIcon('RefreshLeft')">
          <RefreshLeft />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Refresh' }" title="Refresh" @click="selectIcon('Refresh')">
          <Refresh />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Bell' }" title="Bell" @click="selectIcon('Bell')">
          <Bell />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'MuteNotification' }" title="MuteNotification" @click="selectIcon('MuteNotification')">
          <MuteNotification />
        </el-icon>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'User' }" title="User" @click="selectIcon('User')">
          <User />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Check' }" title="Check" @click="selectIcon('Check')">
          <Check />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'CircleCheck' }" title="CircleCheck" @click="selectIcon('CircleCheck')">
          <CircleCheck />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Warning' }" title="Warning" @click="selectIcon('Warning')">
          <Warning />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'CircleClose' }" title="CircleClose" @click="selectIcon('CircleClose')">
          <CircleClose />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Close' }" title="Close" @click="selectIcon('Close')">
          <Close />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'PieChart' }" title="PieChart" @click="selectIcon('PieChart')">
          <PieChart />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'More' }" title="More" @click="selectIcon('More')">
          <More />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Compass' }" title="Compass" @click="selectIcon('Compass')">
          <Compass />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Filter' }" title="Filter" @click="selectIcon('Filter')">
          <Filter />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Switch' }" title="Switch" @click="selectIcon('Switch')">
          <Switch />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Select' }" title="Select" @click="selectIcon('Select')">
          <Select></Select>
        </el-icon>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'SemiSelect' }" title="SemiSelect" @click="selectIcon('SemiSelect')">
          <SemiSelect />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'CloseBold' }" title="CloseBold" @click="selectIcon('CloseBold')">
          <CloseBold />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'EditPen' }" title="EditPen" @click="selectIcon('EditPen')">
          <EditPen />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Edit' }" title="Edit" @click="selectIcon('Edit')">
          <Edit />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Message' }" title="Message" @click="selectIcon('Message')">
          <Message />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'MessageBox' }" title="MessageBox" @click="selectIcon('MessageBox')">
          <MessageBox />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'TurnOff' }" title="TurnOff" @click="selectIcon('TurnOff')">
          <TurnOff />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Finished' }" title="Finished" @click="selectIcon('Finished')">
          <Finished />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Delete' }" title="Delete" @click="selectIcon('Delete')">
          <Delete />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Crop' }" title="Crop" @click="selectIcon('Crop')">
          <Crop />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'SwitchButton' }" title="SwitchButton" @click="selectIcon('SwitchButton')">
          <SwitchButton />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Operation' }" title="Operation" @click="selectIcon('Operation')">
          <Operation />
        </el-icon>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Open' }" title="Open" @click="selectIcon('Open')">
          <Open />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Remove' }" title="Remove" @click="selectIcon('Remove')">
          <Remove />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ZoomOut' }" title="ZoomOut" @click="selectIcon('ZoomOut')">
          <ZoomOut />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ZoomIn' }" title="ZoomIn" @click="selectIcon('ZoomIn')">
          <ZoomIn />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'InfoFilled' }" title="InfoFilled" @click="selectIcon('InfoFilled')">
          <InfoFilled />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'CircleCheckFilled' }" title="CircleCheckFilled" @click="selectIcon('CircleCheckFilled')">
          <CircleCheckFilled />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'SuccessFilled' }" title="SuccessFilled" @click="selectIcon('SuccessFilled')">
          <SuccessFilled />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'WarningFilled' }" title="WarningFilled" @click="selectIcon('WarningFilled')">
          <WarningFilled />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'CircleCloseFilled' }" title="CircleCloseFilled" @click="selectIcon('CircleCloseFilled')">
          <CircleCloseFilled />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'QuestionFilled' }" title="QuestionFilled" @click="selectIcon('QuestionFilled')">
          <QuestionFilled />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'WarnTriangleFilled' }" title="WarnTriangleFilled" @click="selectIcon('WarnTriangleFilled')">
          <WarnTriangleFilled />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'UserFilled' }" title="UserFilled" @click="selectIcon('UserFilled')">
          <UserFilled />
        </el-icon>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'MoreFilled' }" title="MoreFilled" @click="selectIcon('MoreFilled')">
          <MoreFilled />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Tools' }" title="Tools" @click="selectIcon('Tools')">
          <Tools />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'HomeFilled' }" title="HomeFilled" @click="selectIcon('HomeFilled')">
          <HomeFilled />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Menu' }" title="Menu" @click="selectIcon('Menu')">
          <Menu></Menu>
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'UploadFilled' }" title="UploadFilled" @click="selectIcon('UploadFilled')">
          <UploadFilled />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Avatar' }" title="Avatar" @click="selectIcon('Avatar')">
          <Avatar />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'HelpFilled' }" title="HelpFilled" @click="selectIcon('HelpFilled')">
          <HelpFilled />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Share' }" title="Share" @click="selectIcon('Share')">
          <Share />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'StarFilled' }" title="StarFilled" @click="selectIcon('StarFilled')">
          <StarFilled />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Comment' }" title="Comment" @click="selectIcon('Comment')">
          <Comment />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Histogram' }" title="Histogram" @click="selectIcon('Histogram')">
          <Histogram />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Grid' }" title="Grid" @click="selectIcon('Grid')">
          <Grid />
        </el-icon>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Promotion' }" title="Promotion" @click="selectIcon('Promotion')">
          <Promotion />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'DeleteFilled' }" title="DeleteFilled" @click="selectIcon('DeleteFilled')">
          <DeleteFilled />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'RemoveFilled' }" title="RemoveFilled" @click="selectIcon('RemoveFilled')">
          <RemoveFilled />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'CirclePlusFilled' }" title="CirclePlusFilled" @click="selectIcon('CirclePlusFilled')">
          <CirclePlusFilled />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ArrowLeft' }" title="ArrowLeft" @click="selectIcon('ArrowLeft')">
          <ArrowLeft />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ArrowUp' }" title="ArrowUp" @click="selectIcon('ArrowUp')">
          <ArrowUp />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ArrowRight' }" title="ArrowRight" @click="selectIcon('ArrowRight')">
          <ArrowRight />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ArrowDown' }" title="ArrowDown" @click="selectIcon('ArrowDown')">
          <ArrowDown />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ArrowLeftBold' }" title="ArrowLeftBold" @click="selectIcon('ArrowLeftBold')">
          <ArrowLeftBold />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ArrowUpBold' }" title="ArrowUpBold" @click="selectIcon('ArrowUpBold')">
          <ArrowUpBold />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ArrowRightBold' }" title="ArrowRightBold" @click="selectIcon('ArrowRightBold')">
          <ArrowRightBold />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ArrowDownBold' }" title="ArrowDownBold" @click="selectIcon('ArrowDownBold')">
          <ArrowDownBold />
        </el-icon>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'DArrowRight' }" title="DArrowRight" @click="selectIcon('DArrowRight')">
          <DArrowRight />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'DArrowLeft' }" title="DArrowLeft" @click="selectIcon('DArrowLeft')">
          <DArrowLeft />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Download' }" title="Download" @click="selectIcon('Download')">
          <Download />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Upload' }" title="Upload" @click="selectIcon('Upload')">
          <Upload />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Top' }" title="Top" @click="selectIcon('Top')">
          <Top />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Bottom' }" title="Bottom" @click="selectIcon('Bottom')">
          <Bottom />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Back' }" title="Back" @click="selectIcon('Back')">
          <Back />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Right' }" title="Right" @click="selectIcon('Right')">
          <Right />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'TopRight' }" title="TopRight" @click="selectIcon('TopRight')">
          <TopRight />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'TopLeft' }" title="TopLeft" @click="selectIcon('TopLeft')">
          <TopLeft />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'BottomRight' }" title="BottomRight" @click="selectIcon('BottomRight')">
          <BottomRight />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'BottomLeft' }" title="BottomLeft" @click="selectIcon('BottomLeft')">
          <BottomLeft />
        </el-icon>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Sort' }" title="Sort" @click="selectIcon('Sort')">
          <Sort />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'SortUp' }" title="SortUp" @click="selectIcon('SortUp')">
          <SortUp />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'SortDown' }" title="SortDown" @click="selectIcon('SortDown')">
          <SortDown />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Rank' }" title="Rank" @click="selectIcon('Rank')">
          <Rank />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'CaretLeft' }" title="CaretLeft" @click="selectIcon('CaretLeft')">
          <CaretLeft />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'CaretTop' }" title="CaretTop" @click="selectIcon('CaretTop')">
          <CaretTop />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'CaretRight' }" title="CaretRight" @click="selectIcon('CaretRight')">
          <CaretRight />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'CaretBottom' }" title="CaretBottom" @click="selectIcon('CaretBottom')">
          <CaretBottom />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'DCaret' }" title="DCaret" @click="selectIcon('DCaret')">
          <DCaret />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Expand' }" title="Expand" @click="selectIcon('Expand')">
          <Expand />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Fold' }" title="Fold" @click="selectIcon('Fold')">
          <Fold />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'DocumentAdd' }" title="DocumentAdd" @click="selectIcon('DocumentAdd')">
          <DocumentAdd />
        </el-icon>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Document' }" title="Document" @click="selectIcon('Document')">
          <Document />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Notebook' }" title="Notebook" @click="selectIcon('Notebook')">
          <Notebook />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Tickets' }" title="Tickets" @click="selectIcon('Tickets')">
          <Tickets />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Memo' }" title="Memo" @click="selectIcon('Memo')">
          <Memo />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Collection' }" title="Collection" @click="selectIcon('Collection')">
          <Collection />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Postcard' }" title="Postcard" @click="selectIcon('Postcard')">
          <Postcard />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ScaleToOriginal' }" title="ScaleToOriginal" @click="selectIcon('ScaleToOriginal')">
          <ScaleToOriginal />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'SetUp' }" title="SetUp" @click="selectIcon('SetUp')">
          <SetUp />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'DocumentDelete' }" title="DocumentDelete" @click="selectIcon('DocumentDelete')">
          <DocumentDelete />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'DocumentChecked' }" title="DocumentChecked" @click="selectIcon('DocumentChecked')">
          <DocumentChecked />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'DataBoard' }" title="DataBoard" @click="selectIcon('DataBoard')">
          <DataBoard />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'DataAnalysis' }" title="DataAnalysis" @click="selectIcon('DataAnalysis')">
          <DataAnalysis />
        </el-icon>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'CopyDocument' }" title="CopyDocument" @click="selectIcon('CopyDocument')">
          <CopyDocument />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'FolderChecked' }" title="FolderChecked" @click="selectIcon('FolderChecked')">
          <FolderChecked />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Files' }" title="Files" @click="selectIcon('Files')">
          <Files />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Folder' }" title="Folder" @click="selectIcon('Folder')">
          <Folder />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'FolderDelete' }" title="FolderDelete" @click="selectIcon('FolderDelete')">
          <FolderDelete />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'FolderRemove' }" title="FolderRemove" @click="selectIcon('FolderRemove')">
          <FolderRemove />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'FolderOpened' }" title="FolderOpened" @click="selectIcon('FolderOpened')">
          <FolderOpened />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'DocumentCopy' }" title="DocumentCopy" @click="selectIcon('DocumentCopy')">
          <DocumentCopy />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'DocumentRemove' }" title="DocumentRemove" @click="selectIcon('DocumentRemove')">
          <DocumentRemove />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'FolderAdd' }" title="FolderAdd" @click="selectIcon('FolderAdd')">
          <FolderAdd />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'FirstAidKit' }" title="FirstAidKit" @click="selectIcon('FirstAidKit')">
          <FirstAidKit />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Reading' }" title="Reading" @click="selectIcon('Reading')">
          <Reading />
        </el-icon>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'DataLine' }" title="DataLine" @click="selectIcon('DataLine')">
          <DataLine />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Management' }" title="Management" @click="selectIcon('Management')">
          <Management />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Checked' }" title="Checked" @click="selectIcon('Checked')">
          <Checked />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Ticket' }" title="Ticket" @click="selectIcon('Ticket')">
          <Ticket />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Failed' }" title="Failed" @click="selectIcon('Failed')">
          <Failed />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'TrendCharts' }" title="TrendCharts" @click="selectIcon('TrendCharts')">
          <TrendCharts />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'List' }" title="List" @click="selectIcon('List')">
          <List />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Microphone' }" title="Microphone" @click="selectIcon('Microphone')">
          <Microphone />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Mute' }" title="Mute" @click="selectIcon('Mute')">
          <Mute />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Mic' }" title="Mic" @click="selectIcon('Mic')">
          <Mic />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'VideoPause' }" title="VideoPause" @click="selectIcon('VideoPause')">
          <VideoPause />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'VideoCamera' }" title="VideoCamera" @click="selectIcon('VideoCamera')">
          <VideoCamera />
        </el-icon>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'VideoPlay' }" title="VideoPlay" @click="selectIcon('VideoPlay')">
          <VideoPlay />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Headset' }" title="Headset" @click="selectIcon('Headset')">
          <Headset />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Monitor' }" title="Monitor" @click="selectIcon('Monitor')">
          <Monitor />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Film' }" title="Film" @click="selectIcon('Film')">
          <Film />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Camera' }" title="Camera" @click="selectIcon('Camera')">
          <Camera />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Picture' }" title="Picture" @click="selectIcon('Picture')">
          <Picture></Picture>
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'PictureRounded' }" title="PictureRounded" @click="selectIcon('PictureRounded')">
          <PictureRounded />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Iphone' }" title="Iphone" @click="selectIcon('Iphone')">
          <Iphone />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Cellphone' }" title="Cellphone" @click="selectIcon('Cellphone')">
          <Cellphone />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'VideoCameraFilled' }" title="VideoCameraFilled" @click="selectIcon('VideoCameraFilled')">
          <VideoCameraFilled />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'PictureFilled' }" title="PictureFilled" @click="selectIcon('PictureFilled')">
          <PictureFilled />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Platform' }" title="Platform" @click="selectIcon('Platform')">
          <Platform />
        </el-icon>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'CameraFilled' }" title="CameraFilled" @click="selectIcon('CameraFilled')">
          <CameraFilled />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'BellFilled' }" title="BellFilled" @click="selectIcon('BellFilled')">
          <BellFilled />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Location' }" title="Location" @click="selectIcon('Location')">
          <Location />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'LocationInformation' }" title="LocationInformation" @click="selectIcon('LocationInformation')">
          <LocationInformation />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'DeleteLocation' }" title="DeleteLocation" @click="selectIcon('DeleteLocation')">
          <DeleteLocation />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Coordinate' }" title="Coordinate" @click="selectIcon('Coordinate')">
          <Coordinate />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Bicycle' }" title="Bicycle" @click="selectIcon('Bicycle')">
          <Bicycle />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'OfficeBuilding' }" title="OfficeBuilding" @click="selectIcon('OfficeBuilding')">
          <OfficeBuilding />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'School' }" title="School" @click="selectIcon('School')">
          <School />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Guide' }" title="Guide" @click="selectIcon('Guide')">
          <Guide />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'AddLocation' }" title="AddLocation" @click="selectIcon('AddLocation')">
          <AddLocation />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'MapLocation' }" title="MapLocation" @click="selectIcon('MapLocation')">
          <MapLocation />
        </el-icon>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Place' }" title="Place" @click="selectIcon('Place')">
          <Place />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'LocationFilled' }" title="LocationFilled" @click="selectIcon('LocationFilled')">
          <LocationFilled />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Van' }" title="Van" @click="selectIcon('Van')">
          <Van />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Watermelon' }" title="Watermelon" @click="selectIcon('Watermelon')">
          <Watermelon />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Pear' }" title="Pear" @click="selectIcon('Pear')">
          <Pear />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'NoSmoking' }" title="NoSmoking" @click="selectIcon('NoSmoking')">
          <NoSmoking />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Smoking' }" title="Smoking" @click="selectIcon('Smoking')">
          <Smoking />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Mug' }" title="Mug" @click="selectIcon('Mug')">
          <Mug />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'GobletSquareFull' }" title="GobletSquareFull" @click="selectIcon('GobletSquareFull')">
          <GobletSquareFull />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'GobletFull' }" title="GobletFull" @click="selectIcon('GobletFull')">
          <GobletFull />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'KnifeFork' }" title="KnifeFork" @click="selectIcon('KnifeFork')">
          <KnifeFork />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Sugar' }" title="Sugar" @click="selectIcon('Sugar')">
          <Sugar />
        </el-icon>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Bowl' }" title="Bowl" @click="selectIcon('Bowl')">
          <Bowl />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'MilkTea' }" title="MilkTea" @click="selectIcon('MilkTea')">
          <MilkTea />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Lollipop' }" title="Lollipop" @click="selectIcon('Lollipop')">
          <Lollipop />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Coffee' }" title="Coffee" @click="selectIcon('Coffee')">
          <Coffee />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Chicken' }" title="Chicken" @click="selectIcon('Chicken')">
          <Chicken />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Dish' }" title="Dish" @click="selectIcon('Dish')">
          <Dish />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'IceTea' }" title="IceTea" @click="selectIcon('IceTea')">
          <IceTea />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ColdDrink' }" title="ColdDrink" @click="selectIcon('ColdDrink')">
          <ColdDrink />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'CoffeeCup' }" title="CoffeeCup" @click="selectIcon('CoffeeCup')">
          <CoffeeCup />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'DishDot' }" title="DishDot" @click="selectIcon('DishDot')">
          <DishDot />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'IceDrink' }" title="IceDrink" @click="selectIcon('IceDrink')">
          <IceDrink />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'IceCream' }" title="IceCream" @click="selectIcon('IceCream')">
          <IceCream />
        </el-icon>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Dessert' }" title="Dessert" @click="selectIcon('Dessert')">
          <Dessert />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'IceCreamSquare' }" title="IceCreamSquare" @click="selectIcon('IceCreamSquare')">
          <IceCreamSquare />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ForkSpoon' }" title="ForkSpoon" @click="selectIcon('ForkSpoon')">
          <ForkSpoon />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'IceCreamRound' }" title="IceCreamRound" @click="selectIcon('IceCreamRound')">
          <IceCreamRound />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Food' }" title="Food" @click="selectIcon('Food')">
          <Food />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'HotWater' }" title="HotWater" @click="selectIcon('HotWater')">
          <HotWater />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Grape' }" title="Grape" @click="selectIcon('Grape')">
          <Grape />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Fries' }" title="Fries" @click="selectIcon('Fries')">
          <Fries />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Apple' }" title="Apple" @click="selectIcon('Apple')">
          <Apple />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Burger' }" title="Burger" @click="selectIcon('Burger')">
          <Burger />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Goblet' }" title="Goblet" @click="selectIcon('Goblet')">
          <Goblet />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'GobletSquare' }" title="GobletSquare" @click="selectIcon('GobletSquare')">
          <GobletSquare />
        </el-icon>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Orange' }" title="Orange" @click="selectIcon('Orange')">
          <Orange />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Cherry' }" title="Cherry" @click="selectIcon('Cherry')">
          <Cherry />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Printer' }" title="Printer" @click="selectIcon('Printer')">
          <Printer />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Calendar' }" title="Calendar" @click="selectIcon('Calendar')">
          <Calendar />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'CreditCard' }" title="CreditCard" @click="selectIcon('CreditCard')">
          <CreditCard />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Box' }" title="Box" @click="selectIcon('Box')">
          <Box />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Money' }" title="Money" @click="selectIcon('Money')">
          <Money />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Refrigerator' }" title="Refrigerator" @click="selectIcon('Refrigerator')">
          <Refrigerator />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Cpu' }" title="Cpu" @click="selectIcon('Cpu')">
          <Cpu />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Football' }" title="Football" @click="selectIcon('Football')">
          <Football />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Brush' }" title="Brush" @click="selectIcon('Brush')">
          <Brush />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Suitcase' }" title="Suitcase" @click="selectIcon('Suitcase')">
          <Suitcase />
        </el-icon>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'SuitcaseLine' }" title="SuitcaseLine" @click="selectIcon('SuitcaseLine')">
          <SuitcaseLine />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Umbrella' }" title="Umbrella" @click="selectIcon('Umbrella')">
          <Umbrella />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'AlarmClock' }" title="AlarmClock" @click="selectIcon('AlarmClock')">
          <AlarmClock />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Medal' }" title="Medal" @click="selectIcon('Medal')">
          <Medal />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'GoldMedal' }" title="GoldMedal" @click="selectIcon('GoldMedal')">
          <GoldMedal />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Present' }" title="Present" @click="selectIcon('Present')">
          <Present />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Mouse' }" title="Mouse" @click="selectIcon('Mouse')">
          <Mouse />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Watch' }" title="Watch" @click="selectIcon('Watch')">
          <Watch />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'QuartzWatch' }" title="QuartzWatch" @click="selectIcon('QuartzWatch')">
          <QuartzWatch />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Magnet' }" title="Magnet" @click="selectIcon('Magnet')">
          <Magnet />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Help' }" title="Help" @click="selectIcon('Help')">
          <Help />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Soccer' }" title="Soccer" @click="selectIcon('Soccer')">
          <Soccer />
        </el-icon>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ToiletPaper' }" title="ToiletPaper" @click="selectIcon('ToiletPaper')">
          <ToiletPaper />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ReadingLamp' }" title="ReadingLamp" @click="selectIcon('ReadingLamp')">
          <ReadingLamp />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Paperclip' }" title="Paperclip" @click="selectIcon('Paperclip')">
          <Paperclip />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'MagicStick' }" title="MagicStick" @click="selectIcon('MagicStick')">
          <MagicStick />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Basketball' }" title="Basketball" @click="selectIcon('Basketball')">
          <Basketball />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Baseball' }" title="Baseball" @click="selectIcon('Baseball')">
          <Baseball />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Coin' }" title="Coin" @click="selectIcon('Coin')">
          <Coin />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Goods' }" title="Goods" @click="selectIcon('Goods')">
          <Goods />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Sell' }" title="Sell" @click="selectIcon('Sell')">
          <Sell />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'SoldOut' }" title="SoldOut" @click="selectIcon('SoldOut')">
          <SoldOut />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Key' }" title="Key" @click="selectIcon('Key')">
          <Key />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ShoppingCart' }" title="ShoppingCart" @click="selectIcon('ShoppingCart')">
          <ShoppingCart />
        </el-icon>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ShoppingCartFull' }" title="ShoppingCartFull" @click="selectIcon('ShoppingCartFull')">
          <ShoppingCartFull />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ShoppingTrolley' }" title="ShoppingTrolley" @click="selectIcon('ShoppingTrolley')">
          <ShoppingTrolley />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Phone' }" title="Phone" @click="selectIcon('Phone')">
          <Phone />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Scissor' }" title="Scissor" @click="selectIcon('Scissor')">
          <Scissor />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Handbag' }" title="Handbag" @click="selectIcon('Handbag')">
          <Handbag />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ShoppingBag' }" title="ShoppingBag" @click="selectIcon('ShoppingBag')">
          <ShoppingBag />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Trophy' }" title="Trophy" @click="selectIcon('Trophy')">
          <Trophy />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'TrophyBase' }" title="TrophyBase" @click="selectIcon('TrophyBase')">
          <TrophyBase />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Stopwatch' }" title="Stopwatch" @click="selectIcon('Stopwatch')">
          <Stopwatch />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Timer' }" title="Timer" @click="selectIcon('Timer')">
          <Timer />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'CollectionTag' }" title="CollectionTag" @click="selectIcon('CollectionTag')">
          <CollectionTag />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'TakeawayBox' }" title="TakeawayBox" @click="selectIcon('TakeawayBox')">
          <TakeawayBox />
        </el-icon>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'PriceTag' }" title="PriceTag" @click="selectIcon('PriceTag')">
          <PriceTag />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Wallet' }" title="Wallet" @click="selectIcon('Wallet')">
          <Wallet />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Opportunity' }" title="Opportunity" @click="selectIcon('Opportunity')">
          <Opportunity />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'PhoneFilled' }" title="PhoneFilled" @click="selectIcon('PhoneFilled')">
          <PhoneFilled />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'WalletFilled' }" title="WalletFilled" @click="selectIcon('WalletFilled')">
          <WalletFilled />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'GoodsFilled' }" title="GoodsFilled" @click="selectIcon('GoodsFilled')">
          <GoodsFilled />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Flag' }" title="Flag" @click="selectIcon('Flag')">
          <Flag />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'BrushFilled' }" title="BrushFilled" @click="selectIcon('BrushFilled')">
          <BrushFilled />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Briefcase' }" title="Briefcase" @click="selectIcon('Briefcase')">
          <Briefcase />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Stamp' }" title="Stamp" @click="selectIcon('Stamp')">
          <Stamp />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Sunrise' }" title="Sunrise" @click="selectIcon('Sunrise')">
          <Sunrise />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Sunny' }" title="Sunny" @click="selectIcon('Sunny')">
          <Sunny />
        </el-icon>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Ship' }" title="Ship" @click="selectIcon('Ship')">
          <Ship />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'MostlyCloudy' }" title="MostlyCloudy" @click="selectIcon('MostlyCloudy')">
          <MostlyCloudy />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'PartlyCloudy' }" title="PartlyCloudy" @click="selectIcon('PartlyCloudy')">
          <PartlyCloudy />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Sunset' }" title="Sunset" @click="selectIcon('Sunset')">
          <Sunset />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Drizzling' }" title="Drizzling" @click="selectIcon('Drizzling')">
          <Drizzling />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Pouring' }" title="Pouring" @click="selectIcon('Pouring')">
          <Pouring />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Cloudy' }" title="Cloudy" @click="selectIcon('Cloudy')">
          <Cloudy />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Moon' }" title="Moon" @click="selectIcon('Moon')">
          <Moon />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'MoonNight' }" title="MoonNight" @click="selectIcon('MoonNight')">
          <MoonNight />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Lightning' }" title="Lightning" @click="selectIcon('Lightning')">
          <Lightning />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ChromeFilled' }" title="ChromeFilled" @click="selectIcon('ChromeFilled')">
          <ChromeFilled />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Eleme' }" title="Eleme" @click="selectIcon('Eleme')">
          <Eleme />
        </el-icon>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ElemeFilled' }" title="ElemeFilled" @click="selectIcon('ElemeFilled')">
          <ElemeFilled />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'ElementPlus' }" title="ElementPlus" @click="selectIcon('ElementPlus')">
          <ElementPlus />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'Shop' }" title="Shop" @click="selectIcon('Shop')">
          <Shop />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'SwitchFilled' }" title="SwitchFilled" @click="selectIcon('SwitchFilled')">
          <SwitchFilled />
        </el-icon>
      </el-col>
      <el-col :span="2">
        <el-icon :size="20" :class="{ 'icon-item-selected': selected === 'WindPower' }" title="WindPower" @click="selectIcon('WindPower')">
          <WindPower />
        </el-icon>
      </el-col>
    </el-row>
  </el-scrollbar>
</template>

<script setup>
const selected = defineModel();

const selectIcon = (icon) => {
  document.body.click();
  selected.value = icon;
};
</script>

<style lang="scss" scoped>
.el-icon {
  cursor: pointer;
}

.icon-item-selected {
  color: #409eff;
}
</style>
