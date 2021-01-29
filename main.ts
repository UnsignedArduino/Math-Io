controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    timer.background(function () {
        if (!(blockMenu.isMenuOpen())) {
            enable_cursor(false)
            blockMenu.showMenu(["Cancel", "Delete", "Add"], MenuStyle.List, MenuLocation.BottomHalf)
            wait_for_select()
            if (blockMenu.selectedMenuIndex() == 1) {
                if (on_deleteable_tile(sprite_cursor_box)) {
                    tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), assets.tile`transparency16`)
                }
            } else if (blockMenu.selectedMenuIndex() == 2) {
            	
            }
            enable_cursor(true)
        }
    })
})
function on_deleteable_tile (sprite: Sprite) {
    for (let tile of [
    assets.tile`conveyor_right`,
    assets.tile`conveyor_left`,
    assets.tile`conveyor_up`,
    assets.tile`conveyor_down`,
    assets.tile`conveyor_up_left`,
    assets.tile`conveyor_up_right`,
    assets.tile`conveyor_down_left`,
    assets.tile`conveyor_down_right`,
    assets.tile`conveyor_right_down`,
    assets.tile`conveyor_right_up`,
    assets.tile`conveyor_left_down`,
    assets.tile`conveyor_left_up`
    ]) {
        if (sprite.tileKindAt(TileDirection.Center, tile)) {
            return true
        }
    }
    return false
}
function make_cursor () {
    sprite_cursor = sprites.create(assets.image`cursor`, SpriteKind.Player)
    sprite_cursor_pointer = sprites.create(assets.image`cursor_pointer`, SpriteKind.Player)
    sprite_cursor_box = sprites.create(assets.image`cursor_box`, SpriteKind.Player)
    enable_cursor(true)
    tiles.placeOnRandomTile(sprite_cursor_pointer, assets.tile`acceptor`)
    scene.cameraFollowSprite(sprite_cursor_pointer)
    sprite_cursor_pointer.setFlag(SpriteFlag.GhostThroughWalls, true)
    sprite_cursor_pointer.setStayInScreen(true)
}
function enable_cursor (en: boolean) {
    if (en) {
        controller.moveSprite(sprite_cursor_pointer, 64, 64)
    } else {
        controller.moveSprite(sprite_cursor_pointer, 0, 0)
    }
}
function make_map () {
    tiles.setSmallTilemap(tilemap`map`)
    scene.setBackgroundColor(13)
}
function wait_for_select () {
    selected = false
    while (!(selected)) {
        pause(100)
    }
    blockMenu.closeMenu()
}
blockMenu.onMenuOptionSelected(function (option, index) {
    selected = true
})
let selected = false
let sprite_cursor_pointer: Sprite = null
let sprite_cursor: Sprite = null
let sprite_cursor_box: Sprite = null
make_map()
make_cursor()
blockMenu.setColors(1, 15)
game.onUpdate(function () {
    sprite_cursor.top = sprite_cursor_pointer.top
    sprite_cursor.left = sprite_cursor_pointer.left
    sprite_cursor_box.y = sprite_cursor_pointer.top
    sprite_cursor_box.x = sprite_cursor_pointer.left
    tiles.placeOnTile(sprite_cursor_box, tiles.locationOfSprite(sprite_cursor_box))
})
