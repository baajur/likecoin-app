import * as React from "react"
import {
  Image,
  TouchableOpacity,
  View,
} from "react-native"
import ReactNativeSvg from "react-native-svg"
import { observer } from "mobx-react"

import { ContentListItemProps } from "./content-list-item.props"
import { ContentListItemSkeleton } from "./content-list-item.skeleton"
import Style from "./content-list-item.styles"

import { Icon } from "../icon"
import { Text } from "../text"
import { translate } from "../../i18n"

import BookmarkIcon from "./bookmark.svg"

@observer
export class ContentListItem extends React.Component<ContentListItemProps> {
  componentDidMount() {
    if (this.props.content.shouldFetchDetails) {
      this.props.content.fetchDetails()
    }
    this.fetchCreatorDependedDetails()
  }

  componentDidUpdate() {
    this.fetchCreatorDependedDetails()
  }

  private fetchCreatorDependedDetails() {
    if (this.props.content.shouldFetchLikeStat) {
      this.props.content.fetchLikeStat()
    }
    if (this.props.content.shouldFetchCreatorDetails) {
      this.props.content.creator.fetchDetails()
    }
  }

  private onBookmark = () => {
    if (this.props.onBookmark) this.props.onBookmark(this.props.content.url)
  }

  private onPress = () => {
    if (this.props.onPress) this.props.onPress(this.props.content.url)
  }

  render() {
    const {
      content,
      style,
    } = this.props

    const {
      isLoading,
      likeCount,
      imageURL: thumbnailURL,
      title,
    } = content

    if (isLoading) {
      return <ContentListItemSkeleton />
    }

    const rootStyle = {
      ...Style.ROOT,
      ...style,
    }

    return (
      <TouchableOpacity
        onPress={this.onPress}
        style={rootStyle}
      >
        <View style={Style.ROW}>
          <View style={Style.DETAIL_VIEW}>
            {content.creator && content.creator.hasFetchedDetails &&
              <Text
                color="likeGreen"
                size="default"
                weight="600"
                text={content.creator.displayName}
              />
            }
            <Text
              color="grey4a"
              size="medium"
              weight="600"
              text={title}
              style={Style.DETAIL_TEXT}
            />
          </View>
          <View style={Style.IMAGE_WRAPPER}>
            {!!thumbnailURL &&
              <Image
                source={{ uri: thumbnailURL }}
                style={Style.IMAGE_VIEW}
              />
            }
            {content.isBookmarked &&
              <TouchableOpacity onPress={this.onBookmark}>
                {this.renderBookmarkFlag()}
              </TouchableOpacity>
            }
          </View>
        </View>
        <View style={Style.FOOTER}>
          <View>
            {likeCount > 0 &&
              <Text
                text={translate("ContentListItem.likeStatsLabel", { count: likeCount })}
                size="medium"
                prepend={(
                  <Icon
                    name="like-clap"
                    width={24}
                    color="grey9b"
                  />
                )}
                color="grey9b"
              />
            }
          </View>
          <View>
            <TouchableOpacity
              disabled={content.isBookmarked}
              onPress={this.onBookmark}
            >
              <Icon
                name="bookmark-add"
                width={24}
                height={24}
                color={content.isBookmarked ? "offWhite" : "grey4a"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  private renderBookmarkFlag() {
    if (typeof BookmarkIcon !== "function") {
      return <ReactNativeSvg />
    }
    return (
      <BookmarkIcon
        width={24}
        height={24}
        style={Style.BOOKMARK_FLAG}
      />
    )
  }
}
